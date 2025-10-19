import React, { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
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
import GeneratedImagePage from "./components/GeneratedImagePage";
import { TodoType } from "./types/todoType";
import { ChatMessage } from "./types/chatType";
import { nanoid } from "nanoid";

// Main App component wrapped with routing logic
function AppContent() {
  const navigate = useNavigate();
  
  // State management (unchanged)
  const [eventData, setEventData] = useState<EventType>({
    eventType: "",
    date: new Date(),
    location: "",
    price: "",
    attendees: "",
  });

  const [possibleEvents, setPossibleEvents] = useState<string[]>([]);
  const [possibleFeatures, setPossibleFeatures] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [featureIndex, setFeatureIndex] = useState<FeatureType[]>([]);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [currTodo, setCurrTodo] = useState<TodoType | null>(null);
  const [currFeature, setCurrFeature] = useState<FeatureType>({
    uid: '1',
    featureTitle: 'current feature not set',
    selected: null,
    recommended: []
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Navigation helpers - now using React Router
  const goToEventForm = () => navigate("/event-form");
  const goToMainPage = () => navigate("/main");
  const goToSpecificFeature = (featureUid: string) => navigate(`/feature/${featureUid}`);
  const goToSpecificTodo = (todoUid: string) => navigate(`/todo/${todoUid}`);
  const goToGeneratedImage = () => navigate("/generated-image");

  // Fetch features
  const getFeatures = async (eventData: EventType) => {
    try {
      const resp = await getPossibleFeatures(eventData);
      setSelectedFeatures(resp.recommendedFeatures);
      setPossibleFeatures(resp.allFeatures);
    } catch (error) {
      console.error("Error fetching features:", error);
    }
  };

  // Lock in event and navigate to main page
  const lockInEvent = () => {
    const features = selectedFeatures.map((feature) => {
      return {
        uid: nanoid(),
        featureTitle: feature,
        selected: null,
        recommended: [],
      };
    });
    setFeatureIndex(features);
    goToMainPage();
  };

  // Todo helpers
  const onClickTodo = (todo: TodoType) => {
    setCurrTodo(todo);
    goToSpecificTodo(todo.uid);
  };

  const updateTodo = async (updated: TodoType) => {
    const newTodos = todos.map((todo) =>
      todo.uid === updated.uid ? updated : todo
    );
    setTodos(newTodos);
    setCurrTodo(updated);
    await updateTodoRoute(updated.feature, updated);
  };

  // Feature helpers
  const onClickFeature = async (feature: FeatureType) => {
    setCurrFeature(feature);
    goToSpecificFeature(feature.uid);
    
    const recommendations = await getFeatureOptionRecs(
      feature.featureTitle,
      messages,
      feature.recommended
    );

    alert("Your recommendations are ready!");
    feature.recommended = recommendations;
    
    const updatedFeatureIndex = featureIndex.map((f) => {
      if (f.uid === feature.uid) {
        return { ...feature };
      } else {
        return f;
      }
    });
    setFeatureIndex(updatedFeatureIndex);
    setCurrFeature(feature);
  };

  // go to generated image page when at least 1 todo is made
  const handleGenerateImage = () => {
    goToGeneratedImage();
  };

  const onSelectRecommendedFeature = async (recommendation: Recommendation, remove?: true) => {
    try {
      if (remove) {
        // update feature index
        const updatedFeatureIndex = featureIndex.map((feature) => {
          if (feature.uid === currFeature.uid) {
            return {
              ...feature,
              selected: null,
            };
          } else {
            return feature;
          }
      });
      setFeatureIndex(updatedFeatureIndex);
      }
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

      const resp = await recommendationClicked(
        currFeature.featureTitle,
        recommendation
      );
      // alert(JSON.stringify(resp))
      if (resp) {
        console.log("received response from clicking recs");
        setTodos(resp);
      }
    } catch (error) {
      console.log("something went wrong" + error);
    }
  };

  const onConfirm = () => {
    goToMainPage();
  };

  const onEnterChat = async (messageText: ChatMessage) => {
    const newMessages = [...messages, messageText];
    setMessages(newMessages);
    
    const resp = await chatResp(
      newMessages,
      currFeature?.recommended || [],
      currFeature?.featureTitle || ""
    );
    // alert(JSON.stringify(resp))
    // Update featurIndex[feature].recommendations and setMessage([whatever it was before + ai response).
    const aiMessage: ChatMessage = {
      sender: "bot",
      message: resp.response,
    };
    setMessages([...newMessages, aiMessage]);
    
    if (resp.newRecs && currFeature) {
      setCurrFeature({
        ...currFeature,
        recommended: resp.newRecs,
      });
      
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
    const fetchEventTypes = async () => {
      const events = await getEventTypes();
      setPossibleEvents(events);
    };
    fetchEventTypes();
  }, []);

  return (
    <Routes>
      {/* Home/Get Started */}
      <Route path="/" element={
        <GetStarted goToNextPage={goToEventForm} />
      } />

      {/* Event Form */}
      <Route path="/event-form" element={
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
      } />

      {/* Main Page */}
      <Route path="/main" element={
        <MainPage
          todos={todos}
          onClickTodo={onClickTodo}
          updateTodo={updateTodo}
          featureIndex={featureIndex}
          onClickFeature={onClickFeature}
          onGenerateImage={handleGenerateImage}
        />
      } />

      {/** Generate Image */}
      <Route path="/generated-image" element={
        <GeneratedImagePage featureIndex={featureIndex} />
      } />

      {/* Specific Feature - uses URL parameter */}
      <Route path="/feature/:featureUid" element={
        <FeatureRoute
          featureIndex={featureIndex}
          currFeature={currFeature}
          onSelectRecommendedFeature={onSelectRecommendedFeature}
          messages={messages}
          onEnterChat={onEnterChat}
          onConfirm={onConfirm}
        />
      } />

      {/* Specific Todo - uses URL parameter */}
      <Route path="/todo/:todoUid" element={
        <TodoRoute
          todos={todos}
          currTodo={currTodo}
          updateTodo={updateTodo}
        />
      } />
    </Routes>
  );
}

// Wrapper component for Feature route to access URL params
function FeatureRoute({ 
  featureIndex, 
  currFeature, 
  onSelectRecommendedFeature, 
  messages, 
  onEnterChat, 
  onConfirm 
}: any) {
  const { featureUid } = useParams();
  
  // Find the feature from the index based on URL parameter
  const feature = featureIndex.find((f: FeatureType) => f.uid === featureUid) || currFeature;
  
  return (
    <SpecificFeature
      feature={feature}
      onSelectedRecommneded={onSelectRecommendedFeature}
      messages={messages}
      onSendMessage={onEnterChat}
      onConfirm={onConfirm}
    />
  );
}

// Wrapper component for Todo route to access URL params
function TodoRoute({ todos, currTodo, updateTodo }: any) {
  const { todoUid } = useParams();
  
  // Find the todo based on URL parameter
  const todo = todos.find((t: TodoType) => t.uid === todoUid) || currTodo;
  
  return (
    <SpecificTodo todo={todo} updateTodo={updateTodo} />
  );
}

// Main App component with Router wrapper
function App() {
  return (
    <div className="App">
      <main className="page content">
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;