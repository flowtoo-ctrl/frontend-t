import React from 'react';

const EventList = ({ events, onSelect }) => (
  <div>
    <h2>Events</h2>
    {events.map(event => (
      <div key={event._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
        <p>Location: {event.location}</p>
        <p>Price: R{event.price}</p>
        <button onClick={() => onSelect(event)}>Buy Ticket</button>
      </div>
    ))}
  </div>
);

export default EventList;

