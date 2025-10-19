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
    possibleFeatures,
    selectedFeatures,
    lockInEvent,
    getFeatures,
    updateEvent,
  });
  return(
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
          backgroundColor: '#EFD7D5', // pink
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
        {/* Grey circle */}
        <div
          style={{
            backgroundColor: '#D9D9D9', // grey color
            height: '100px',
            width: '100px',
            borderRadius: '50%', // makes it a circle
            position: 'absolute',
            left: '40px',
            top: '50%',
            transform: 'translateY(-50%)', // centers vertically
          }}
          aria-hidden="true"
        />
        {/* Text box with Carattere font */}
        <div
          style={{
            position: 'absolute',
            left: '183px', // 63px (circle left) + 100px (circle width) + 20px (spacing)
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '16px',
          }}
        >
          <h1 className = "event-form-text">Coordin-AI-te</h1>
        </div>
      </div>
      {/* Event form top photo */}
      <div
        style={{
          width: '100vw',
          marginLeft: '-8px'          
        }}
      >
        <img
          src="https://plus.unsplash.com/premium_photo-1674235766088-80d8410f9523?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2VkZGluZyUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=700"
          style={{
            width: '100vw',
            height: '350px',
            objectFit: 'cover',
            objectPosition: '50% 40%',
            display: 'block',
            transform: 'scale(1)', // Slightly zoom out the image
            transformOrigin: 'center center',
          }}
        />
      </div>
      {/* Dropdown menu */}
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
      {/* Left Image Pg 2 */}
      <div
        style={{
          width: '100vw',
          paddingTop: '150px',
          marginLeft: '-8px'          
        }}
      >
        <img
          src="https://img.freepik.com/premium-photo/elegant-wedding-background-design_1287624-42710.jpg"
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
          position: 'absolute',
          left: '450px',
          top: '825px',
          marginTop: '75px',
          textAlign: 'left',
          fontSize: '32px',
          fontWeight: 'normal',
          paddingLeft: '275px'
        }}
      >
        <h1 className="event-form-question-text">When will the event take place?</h1>
      </div>
      {/*Date Dropdown Menu */}
      <div
        style={{
          position: 'absolute',
          left: '250px',
          top: '950px',
          textAlign: 'left',
          paddingLeft: '275px',
          marginTop: '20px'
        }}
      >
        <select
          style={{
            width: '400px',
            color: 'black',
            backgroundColor:'#D29C9A',
            padding: '10px',
            fontSize: '18px',
            borderRadius: '100px',
          }}
        >
          <option value="">Select a month...</option>
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
          ))
        </select>
      </div>
            <div
        style={{
          position: 'absolute',
          left: '750px',
          top: '950px',
          textAlign: 'left',
          paddingLeft: '275px',
          marginTop: '20px'
        }}
      >
        <select
          style={{
            width: '200px',
            color: 'black',
            backgroundColor:'#D29C9A',
            padding: '10px',
            fontSize: '18px',
            borderRadius: '100px',
          }}
        >
          <option value="">Select a day...</option>
          {[...Array(31)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      </div>
      <div>Event Form Component</div>
    </div>
  )
}


export default EventForm;
