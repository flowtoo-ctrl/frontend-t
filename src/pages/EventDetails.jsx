import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EventDetails.css';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setEmail(user.email);
    }
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTicket = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setProcessing(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('http://localhost:5000/api/payments/buy', {
        eventId: id,
        email: email,
        userId: user?.id,
      });

      if (response.data.success && response.data.paymentData && response.data.endpoint) {
        // Create and submit form to PayFast
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = response.data.endpoint;

        Object.entries(response.data.paymentData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        alert('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading event...</div>;
  }

  if (!event) {
    return (
      <div className="not-found">
        <h2>Event not found</h2>
        <button onClick={() => navigate('/')}>Back to Events</button>
      </div>
    );
  }

  return (
    <div className="event-details">
      <button className="back-btn" onClick={() => navigate('/')}>← Back</button>

      <div className="details-container">
        <div className="event-main">
          {event.image && <img src={event.image} alt={event.title} />}
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          
          <div className="event-meta">
            <div>
              <strong>📅 Date & Time</strong>
              <p>{new Date(event.date).toLocaleString()}</p>
            </div>
            <div>
              <strong>📍 Location</strong>
              <p>{event.location}</p>
            </div>
            <div>
              <strong>🎫 Tickets Available</strong>
              <p>{event.ticketsAvailable}</p>
            </div>
          </div>
        </div>

        <div className="checkout-card">
          <h3>Purchase Ticket</h3>
          <div className="price">R {event.price.toFixed(2)}</div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={processing}
            />
          </div>

          <button
            className="pay-btn"
            onClick={handleBuyTicket}
            disabled={processing || event.ticketsAvailable <= 0}
          >
            {processing ? 'Processing...' : 'Proceed to Payment'}
          </button>

          {event.ticketsAvailable <= 0 && (
            <p className="sold-out-msg">This event is sold out</p>
          )}

          <p className="disclaimer">
            You will be redirected to PayFast to complete your payment securely.
          </p>
        </div>
      </div>
    </div>
  );
}


