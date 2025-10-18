import React from 'react';
import { EventDataType } from '../types/eventDataType';

// Define the props type
interface EventFormProps {
  possibleFeatures: string[];
  selectedFeatures: string[];
  lockInEvent: (eventData: EventDataType) => void;
}

// Correct usage
function EventForm({ possibleFeatures, selectedFeatures, lockInEvent }: EventFormProps) {
    const [whichSection, setWhichSection] = React.useState<1|2|3|4>(1);
    const [selectedEvent, setSelectedEvent] = React.useState<string>('');
    const [date, setDate] = React.useState<string>('');
    const [location, setLocation] = React.useState<string>('');
    const [priceRange, setPriceRange] = React.useState<string>('');
    const [attendeesRange, setAttendeesRange] = React.useState<number>(0);

    return (
        <div>
            Event Form Component
        </div>
    );
}

export default EventForm;