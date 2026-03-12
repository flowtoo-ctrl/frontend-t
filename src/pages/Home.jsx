import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🎫 TicketHub</h1>
          <div className="header-right">
            {user ? (
              <>
                <span className="user-email">{user.email}</span>
                <button className="nav-btn" onClick={() => navigate('/my-tickets')}>My Tickets</button>
                {user.role === 'admin' && (
                  <button className="nav-btn" onClick={() => navigate('/create-event')}>Create Event</button>
                )}
                <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
                <button className="nav-btn signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <h2>Discover Amazing Events</h2>
        <p>Browse and purchase tickets for the best events in your area.</p>
      </section>

      {/* Events Grid */}
      <section className="events-section">
        <h3>Upcoming Events</h3>
        {events.length === 0 ? (
          <p className="no-events">No events available at the moment.</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                {event.image && <img src={event.image} alt={event.title} />}
                <div className="event-content">
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                  <div className="event-info">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <div className="event-footer">
                    <span className="price">R {event.price.toFixed(2)}</span>
                    <span className={`tickets ${event.ticketsAvailable > 0 ? 'available' : 'sold-out'}`}>
                      {event.ticketsAvailable > 0 ? `${event.ticketsAvailable} tickets` : 'Sold Out'}
                    </span>
                  </div>
                  <button
                    className="buy-btn"
                    disabled={event.ticketsAvailable <= 0}
                    onClick={() => navigate(`/event/${event._id}`)}
                  >
                    {event.ticketsAvailable > 0 ? 'Buy Ticket' : 'Sold Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


