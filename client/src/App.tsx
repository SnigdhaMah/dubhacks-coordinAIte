import React from 'react';
import { useState } from 'react';
import { EventType } from './types/eventType';
import { FeatureType, Recommendation } from './types/featureType';
import EventForm from './components/EventForm';
import { getFeatureRecommendations } from './utils/apis';
import './style.css';
import GetStarted from './components/GetStarted';
import MainPage from './components/MainPage';
import SpecificFeature from './components/SpecificFeature';
import SpecificTodo from './components/SpecificTodo';
import { TodoType } from './types/todoType';
import { ChatMessage } from './types/chatType';

function App() {
  // generic state 
    // page/stage type used by navigation helpers
  type AppStage = 'GET STARTED' | 'EVENT FORM' | 'MAIN PAGE' | 'SPECIFIC FEATURE' | 'SPECIFIC TODO';
  const [currentStage, setCurrentStage] = React.useState<AppStage>('GET STARTED');
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
  const [currFeature, setCurrFeature] = useState<string | null>(null);

  // chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // getFeatures: fetch features / recommendations for a given event context
  const getFeatures = async (eventType: string, date: number, location: string, price: string) => {
    // do this
  };

  // lockInEvent: persist basic event data, initialize feature index, and navigate to main page
  const lockInEvent = (eventType: string, date: number, location: string, price: string, selected: string[]) => {
    // todo 
  };

  // todo helpers
  const onClickTodo = (todo: TodoType) => {
    // todo 
  };

  const updateTodo = (updated: TodoType) => {
    // todo
  };

  // feature helpers
  const onClickFeature = (feature: FeatureType) => {
     // todo
  };

  const onSelectRecommendedFeature = (recommendation: Recommendation) => {
    // todo
  };

  // chat / assistant helper (stubbed - replace with real API call)
  const onEnterChat = async (feature: string, messageText: string) => {
    // todo
  };

    return (
    <div className="App">
      <h1 className="Get Started Header">Event Planning</h1>

      <main className="page content">
        {
          currentStage === 'GET STARTED'? (
            <div>
              <GetStarted goToNextPage={() => setCurrentStage('EVENT FORM')} />
            </div>
          ): currentStage === 'EVENT FORM'? (
            <div>
              <EventForm
                possibleFeatures={[]}
                selectedFeatures={[]}
                lockInEvent={(eventData: EventType) => {
                  console.log("Event locked in:", eventData);
                }}
              />
            </div>
          ): currentStage === 'MAIN PAGE'? (
            <div>
              <MainPage todos={todos} onClickTodo={onClickTodo} featureIndex={featureIndex} onClickFeature={onClickFeature} />
            </div>
          ): currentStage === 'SPECIFIC FEATURE'? (
            <div>
              <SpecificFeature feature={currFeature} featureIndex={featureIndex} onSelectedRecommneded={onSelectRecommendedFeature} 
              messages={messages} onSendMessage={onSendMessage} />
            </div>
          ): currentStage === 'SPECIFIC TODO'? (
            <div>
              <SpecificTodo todo={currTodo} updateTodo={onEnterChat} />
            </div>
          ): null
        }
      </main>
    </div>
  )
}

export default App;