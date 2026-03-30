import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import './Home.css';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // modal state
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
      const response = await axios.get(`${API_BASE_URL}/api/events`);
      setEvents(response.data.events || response.data);
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

      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <h1>🎫 TicketHub</h1>

          <div className="header-right">
            {user ? (
              <>
                <span className="user-email">{user.email}</span>

                <button
                  className="nav-btn"
                  onClick={() => navigate('/my-tickets')}
                >
                  My Tickets
                </button>

                <button
                  className="nav-btn logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="nav-btn"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>

                <button
                  className="nav-btn signup-btn"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <h2>Discover Amazing Events</h2>
        <p>Browse and purchase tickets for the best events in your area.</p>
      </section>

      {/* ADMIN BUTTON */}
      {user && user.role === 'admin' && (
        <div className="create-event-section">
          <button
            className="create-event-btn"
            onClick={() => navigate('/create-event')}
          >
            + Create New Event
          </button>
        </div>
      )}

      {/* EVENTS */}
      <section className="events-section">
        <h3>Upcoming Events</h3>

        {events.length === 0 ? (
          <p className="no-events">No events available at the moment.</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card">

                {event.image && (
                  <img
                    src={event.image.startsWith('http')
                      ? event.image
                      : `${API_BASE_URL}/${event.image}`}
                    alt={event.title}
                  />
                )}

                <div className="event-content">
                  <h4>{event.title}</h4>

                  <p>
                    {event.description?.slice(0, 100)}...
                  </p>

                  <div className="event-info">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>📍 {event.location}</span>
                  </div>

                  <div className="event-footer">
                    <span className="price">
                      From R {event.price ? event.price.toFixed(2) : "0.00"}
                    </span>
                  </div>

                  {/* 🔥 OPEN MODAL */}
                  <button
                    className="buy-btn"
                    onClick={() => setSelectedEvent(event)}
                  >
                    View Details
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🔥 GLASS MODAL */}
      {selectedEvent && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-btn"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>

            {selectedEvent.image && (
              <img
                src={selectedEvent.image.startsWith('http')
                  ? selectedEvent.image
                  : `${API_BASE_URL}/${selectedEvent.image}`}
                alt={selectedEvent.title}
              />
            )}

            <h2>{selectedEvent.title}</h2>

            <p className="modal-description">
              {selectedEvent.description}
            </p>

            <div className="modal-info">
              <span>📅 {new Date(selectedEvent.date).toLocaleDateString()}</span>
              <span>📍 {selectedEvent.location}</span>
            </div>

            <div className="modal-price">
              From R {selectedEvent.price?.toFixed(2) || "0.00"}
            </div>

            <button
              className="buy-btn"
              onClick={() => navigate(`/event/${selectedEvent._id}`)}
            >
              Buy Ticket
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

