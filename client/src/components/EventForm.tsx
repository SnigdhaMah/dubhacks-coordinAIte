import React from 'react';
import { EventType } from "../types/eventType";

// Define the props type
interface EventFormProps {
  eventData: EventType;
  possibleEvents: string[];
  possibleFeatures: string[];
  selectedFeatures: string[];
  getFeatures: (
    eventType: string,
    date: Date,
    location: string,
    price: string,
    attendees: string
  ) => Promise<void>;
  lockInEvent: (eventData: EventType) => void;
  updateEvent: (eventData: EventType) => void;
  updateSelectedFeatures: (features: string[]) => void;
}

// Correct usage
function EventForm({
  eventData,
  possibleEvents,
  possibleFeatures,
  selectedFeatures,
  lockInEvent,
  getFeatures,
  updateEvent,
}: EventFormProps) {
  console.log("EventForm props:", {
    eventData,
    possibleEvents,
    possibleFeatures,
    selectedFeatures,
    lockInEvent,
    getFeatures,
    updateEvent,
  });
  return <div>Event Form Component</div>;
}

export default EventForm;