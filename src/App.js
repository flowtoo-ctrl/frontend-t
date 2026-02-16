import React, { useState, useEffect } from 'react';
import EventList from './components/EventList';
import CreateEvent from './components/CreateEvent';
import BuyTicket from './components/BuyTicket';
import './App.css'; // ← make sure this import is present

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Failed to load events:', err));
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Local Events Ticketing (Pretoria MVP)</h1>
      </header>

      <main className="main-content">
        <section className="create-event-section">
          <CreateEvent 
            onEventCreated={(newEvent) => setEvents([...events, newEvent])} 
          />
        </section>

        <section className="events-section">
          <EventList 
            events={events} 
            onSelect={setSelectedEvent} 
          />
        </section>

        {selectedEvent && (
          <div className="buy-ticket-modal-overlay">
            <div className="buy-ticket-modal">
              <BuyTicket 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)} // optional: add close button support
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

