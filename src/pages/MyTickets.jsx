import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyTickets.css';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTickets(token);
  }, [navigate]);

  const fetchTickets = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/tickets/my', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to load tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  return (
    <div className="my-tickets">
      <button className="back-btn" onClick={() => navigate('/')}>← Back to Events</button>
      
      <h1>My Tickets</h1>

      {error && <div className="error-message">{error}</div>}

      {tickets.length === 0 ? (
        <div className="no-tickets">
          <p>You haven't purchased any tickets yet.</p>
          <button onClick={() => navigate('/')}>Browse Events</button>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <div className="ticket-header">
                <h3>{ticket.event?.title || 'Event'}</h3>
                <span className={`status ${ticket.status}`}>{ticket.status}</span>
              </div>
              
              <div className="ticket-info">
                <p><strong>ID:</strong> {ticket.paymentId}</p>
                <p><strong>📅 Date:</strong> {new Date(ticket.event?.date).toLocaleDateString()}</p>
                <p><strong>📍 Location:</strong> {ticket.event?.location}</p>
                <p><strong>💰 Price:</strong> R {ticket.event?.price.toFixed(2)}</p>
                <p><strong>Purchased:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
              </div>

              <button
                className="qr-btn"
                onClick={() => {
                  if (ticket.qrCode) {
                    window.open(ticket.qrCode, '_blank');
                  }
                }}
                disabled={!ticket.qrCode}
              >
                📱 View QR Code
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


