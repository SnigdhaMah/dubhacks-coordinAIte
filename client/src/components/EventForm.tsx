import React, { useState } from 'react';
import { EventType } from "../types/eventType";

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

function EventForm({
  eventData,
  possibleEvents,
  possibleFeatures,
  selectedFeatures,
  lockInEvent,
  getFeatures,
  updateEvent,
}: EventFormProps) {
  // Local state for date components
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [year, setYear] = useState<string>('');

  // Generate array of years (current year to 5 years ahead)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

  // Handle date changes and update parent component
  const handleDateChange = (newMonth: string, newDay: string, newYear: string) => {
    setMonth(newMonth);
    setDay(newDay);
    setYear(newYear);

    // If all three values are selected, create a Date object and update eventData
    if (newMonth && newDay && newYear) {
      const monthIndex = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ].indexOf(newMonth);
      
      const date = new Date(parseInt(newYear), monthIndex, parseInt(newDay));
      updateEvent({ ...eventData, date });
    }
  };


console.log("EventForm props:", {
    eventData,
    possibleFeatures,
    selectedFeatures,
    lockInEvent,
    getFeatures,
    updateEvent,
  });

  return (
    <div style={{ 
      width: '100vw', 
      backgroundColor: '#FFFFFF',
      marginLeft: -8,
      marginRight: -8,
      paddingLeft: 8,
      paddingRight: 8,
    }}>
      {/* Pink horizontal box at the top of the form */}
      <div
        style={{
          backgroundColor: '#EFD7D5',
          height: '33px',
          width: '100vw',
          margin: 0,
          marginLeft: -8,
          marginRight: -8,
          marginTop: -8,
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 8,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        aria-hidden="true"
      />
      
      {/* White box with centered grey circle */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          height: '138px',
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            backgroundColor: '#D9D9D9',
            height: '100px',
            width: '100px',
            borderRadius: '50%',
            position: 'absolute',
            left: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          aria-hidden="true"
        />
        <div
          style={{
            position: 'absolute',
            left: '183px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '16px',
          }}
        >
          <h1 className="event-form-text">Coordin-AI-te</h1>
        </div>
      </div>

      {/* Event form top photo */}
      <div style={{ width: '100vw', marginLeft: '-8px' }}>
        <img
          src="https://plus.unsplash.com/premium_photo-1674235766088-80d8410f9523?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2VkZGluZyUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=700"
          alt="Event background"
          style={{
            width: '100vw',
            height: 'auto',
            objectFit: 'cover',
            objectPosition: '50% 40%',
            display: 'block',
            transform: 'scale(1)',
            position: 'relative',
          }}
        />
      </div>

      {/* Event Type Selection */}
      <div
        style={{
          marginTop: '75px',
          textAlign: 'left',
          fontSize: '32px',
          fontWeight: 'normal',
          position: 'relative',
          paddingLeft: '275px'
        }}
      >
        <h1 className="event-form-question-text">What event are we planning today?</h1>
      </div>
      <div
        style={{
          textAlign: 'left',
          paddingLeft: '275px',
          marginTop: '20px'
        }}
      >
        <select
          style={{
            width: '800px',
            color: 'white',
            backgroundColor:'#4B3831',
            padding: '10px',
            fontSize: '18px',
            borderRadius: '100px',
          }}
          value={eventData.eventType || ''}
          onChange={(e) => updateEvent({ ...eventData, eventType: e.target.value })}
        >
          <option value="">Select an event...</option>
          {possibleEvents.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
        </select>
      </div>

      {/* Left Image & Date Selection */}
      <div
        style={{
          width: '100vw',
          paddingTop: '150px',
          marginLeft: '-8px'          
        }}
      >
        <img
          src="https://img.freepik.com/premium-photo/elegant-wedding-background-design_1287624-42710.jpg"
          alt="Wedding background"
          style={{
            width: '400px',
            height: '1500px',
            objectFit: 'cover',
            objectPosition: '100% 40%',
            display: 'block',
            transformOrigin: 'center center',
          }}
        />

        {/* Date Question Text */}
        <div
          style={{
            position: 'relative',
            left: '500px',
            marginTop: '75px',
            textAlign: 'left',
            fontSize: '32px',
            fontWeight: 'normal',
            paddingLeft: '275px'
          }}
        >
          <h1 className="event-form-question-text">When will the event take place?</h1>
        </div>

        {/* Date Dropdowns Container */}
        <div
          style={{
            position: 'relative',
            left: '725px',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          {/* Month Dropdown */}
          <select
            style={{
              width: '200px',
              color: 'black',
              backgroundColor:'#D29C9A',
              padding: '10px',
              fontSize: '18px',
              borderRadius: '100px',
              cursor: 'pointer',
            }}
            value={month}
            onChange={(e) => handleDateChange(e.target.value, day, year)}
          >
            <option value="">Month...</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>

          {/* Day Dropdown */}
          <select
            style={{
              width: '150px',
              color: 'black',
              backgroundColor:'#D29C9A',
              padding: '10px',
              fontSize: '18px',
              borderRadius: '100px',
              cursor: 'pointer',
            }}
            value={day}
            onChange={(e) => handleDateChange(month, e.target.value, year)}
          >
            <option value="">Day...</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            style={{
              width: '150px',
              color: 'black',
              backgroundColor:'#D29C9A',
              padding: '10px',
              fontSize: '18px',
              borderRadius: '100px',
              cursor: 'pointer',
            }}
            value={year}
            onChange={(e) => handleDateChange(month, day, e.target.value)}
          >
            <option value="">Year...</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default EventForm;