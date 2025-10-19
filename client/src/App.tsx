import React, { useEffect } from "react";
import { useState } from "react";
import { EventType } from "./types/eventType";
import { FeatureType, Recommendation } from "./types/featureType";
import EventForm from "./components/EventForm";
import {
  chatResp,
  getEventTypes,
  getFeatureOptionRecs,
  getPossibleFeatures,
  recommendationClicked,
  updateTodoRoute,
} from "./utils/apis";
import "./style.css";
import GetStarted from "./components/GetStarted";
import MainPage from "./components/MainPage";
import SpecificFeature from "./components/SpecificFeature";
import SpecificTodo from "./components/SpecificTodo";
import { TodoType } from "./types/todoType";
import { ChatMessage } from "./types/chatType";
import { nanoid } from "nanoid";

function App() {
  // generic state
  // page/stage type used by navigation helpers
  type AppStage =
    | "GET STARTED"
    | "EVENT FORM"
    | "MAIN PAGE"
    | "SPECIFIC FEATURE"
    | "SPECIFIC TODO";
  const [currentStage, setCurrentStage] =
    React.useState<AppStage>("GET STARTED");
  const [eventData, setEventData] = useState<EventType>({
    eventType: "",
    date: new Date(),
    location: "",
    price: "", // range
    attendees: "", // range
  });

  // navigation helper
  const goToNextPage = (nextPage: AppStage) => {
    setCurrentStage(nextPage);
  };

  // event-form / feature discovery state
  const [possibleEvents, setPossibleEvents] = useState<string[]>([]);
  const [possibleFeatures, setPossibleFeatures] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // feature index state: map feature name -> data about that feature
  const [featureIndex, setFeatureIndex] = useState<FeatureType[]>([]);

  // todos state
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [currTodo, setCurrTodo] = useState<TodoType | null>(null);

  // current feature for SpecificFeature page
  const [currFeature, setCurrFeature] = useState<FeatureType | null>(null);

  // chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // getFeatures: fetch features / recommendations for a given event context
  const getFeatures = async (
    eventType: string,
    date: Date,
    location: string,
    price: string,
    attendees: string
  ) => {
    // will call the server with the passed in parameters to get an response like
    // {allFeatures: string[], recommendedFeatures: string[] }.
    // The function will use the server's response to call setSelectedFeatures and setPossibleFeatures accordingly.
    try {
      const eventData: EventType = {
        eventType,
        date,
        location,
        price,
        attendees,
      };
      const resp = await getPossibleFeatures(eventData); // {allFeatures: string[], recommendedFeatures: string[] }.
      setSelectedFeatures(resp.recommendedFeatures);
      setPossibleFeatures(resp.allFeatures);
    } catch (error) {
      console.error("Error fetching features:", error);
    }
  };

  // lockInEvent: persist basic event data, initialize feature index, and navigate to main page
  const lockInEvent = () => {
    // set the App.tsx state for the basic event data (setEventInfo) => already done with setEventData
    // set up the feature index. call goToNextPage("MainPage")
    const features = selectedFeatures.map((feature) => {
      return {
        uid: nanoid(), // use nanoid to generate a unique id
        featureTitle: feature,
        selected: null, // nothing is selected yet
        recommended: [], // no recommendations yet
      };
    });
    setFeatureIndex(features);

    goToNextPage("MAIN PAGE");
  };

  // todo helpers
  const onClickTodo = (todo: TodoType) => {
    // call setCurrPage("SpecificTodo") and setCurrTodo(todo) so that we go to the SpecificTodo page with the specified todo as the todo to display
    setCurrTodo(todo);
    setCurrentStage("SPECIFIC TODO");
  };

  const updateTodo = async (updated: TodoType) => {
    const newTodos = todos.map((todo) =>
      todo.uid === updated.uid ? updated : todo
    );
    setTodos(newTodos);
    // update the current todo shown in SpecificTodo
    setCurrTodo(updated);
    // update the todos in the server
    await updateTodoRoute(updated.feature, updated);
  };

  // feature helpers
  const onClickFeature = async (feature: FeatureType) => {
    // based on the feature passed, call setCurrPage("SpecificFeature") and setCurrFeature(feature) so that we go to the SpecificFeature page with the specified feature displayed
    const recommendations = await getFeatureOptionRecs(
      feature.featureTitle,
      messages,
      feature.recommended
    );
    alert(JSON.stringify(recommendations));
    feature.recommended = recommendations;
    setCurrFeature(feature);
    setCurrentStage("SPECIFIC FEATURE");
  };

  const onSelectRecommendedFeature = async (recommendation: Recommendation) => {
    try {
      if (!currFeature) return;
      const resp = await recommendationClicked(
        currFeature.featureTitle,
        recommendation
      );
      if (resp) {
        // update todos
        setTodos(resp);
        // update feature index
        const updatedFeatureIndex = featureIndex.map((feature) => {
          if (feature.uid === currFeature.uid) {
            return {
              ...feature,
              selected: recommendation,
            };
          } else {
            return feature;
          }
        });
        setFeatureIndex(updatedFeatureIndex);
      }
    } catch (error) {}
  };

  // the user has confirmed their selections in SpecificFeature page
  const onConfirm = () => {
    setCurrentStage("MAIN PAGE");
  };

  const onEnterChat = async (messageText: ChatMessage) => {
    // The user hits enter in the chatbot messages,
    // we will update setMessages([whatever it was before + message) to have the user's current message.
    const newMessages = [...messages, messageText];
    setMessages(newMessages);
    // Then, we will call the server with (feature, messages, current recommendations)
    // which will return us a chat response as well as updated recommendations.
    const resp = await chatResp(
      newMessages,
      currFeature?.recommended || [],
      currFeature?.featureTitle || ""
    );
    // Update featurIndex[feature].recommendations and setMessage([whatever it was before + ai response).
    const aiMessage: ChatMessage = {
      sender: "bot",
      message: resp.response,
    };
    setMessages([...newMessages, aiMessage]);
    if (resp.newRecs && currFeature) {
      // update currFeature with new recommendations
      setCurrFeature({
        ...currFeature,
        recommended: resp.newRecs,
      });
      // update feature index with new recommendations
      const updatedFeatureIndex = featureIndex.map((feature) => {
        if (feature.uid === currFeature.uid) {
          return {
            ...feature,
            recommended: resp.newRecs || feature.recommended,
          };
        } else {
          return feature;
        }
      });
      setFeatureIndex(updatedFeatureIndex);
    }
  };

  useEffect(() => {
    // on initial load, get possible event types from server
    const fetchEventTypes = async () => {
      const events = await getEventTypes();
      setPossibleEvents(events);
    };
    fetchEventTypes();
    setTodos([
      ...todos,
      {
        todo: "Buy Flowers",
        description: "Go to Flowers on the Ave and buy some flowers ig",
        uid: "0",
        feature: "flowers",
        completed: false,
        type: "generic",
      } as TodoType,
    ]);
  }, []);

  return (
    <div className="App">
      <main className="page content">
        {currentStage === "GET STARTED" ? (
          <div>
            <GetStarted goToNextPage={() => setCurrentStage("EVENT FORM")} />
          </div>
        ) : currentStage === "EVENT FORM" ? (
          <div>
            <EventForm
              possibleEvents={possibleEvents}
              possibleFeatures={possibleFeatures}
              selectedFeatures={selectedFeatures}
              getFeatures={getFeatures}
              eventData={eventData}
              updateEvent={setEventData}
              updateSelectedFeatures={setSelectedFeatures}
              lockInEvent={lockInEvent}
            />
          </div>
        ) : currentStage === "MAIN PAGE" ? (
          <div>
            <MainPage
              todos={todos}
              onClickTodo={onClickTodo}
              updateTodo={updateTodo}
              featureIndex={featureIndex}
              onClickFeature={onClickFeature}
            />
          </div>
        ) : currentStage === "SPECIFIC FEATURE" ? (
          <div>
            <SpecificFeature
              feature={currFeature}
              onSelectedRecommneded={onSelectRecommendedFeature}
              messages={messages}
              onSendMessage={onEnterChat}
              onConfirm={onConfirm}
            />
          </div>
        ) : currentStage === "SPECIFIC TODO" ? (
          <div>
            <SpecificTodo todo={currTodo} updateTodo={updateTodo} />
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;
