import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import "./EventDetails.css";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [email, setEmail] = useState("");
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchEvent = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching event with ID:", id);
      // FIXED: Correct template literal syntax
      const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
      console.log("Event fetched:", response.data);
      setEvent(response.data);

      if (response.data.ticketTypes?.length > 0) {
        setSelectedTicketType(response.data.ticketTypes[0].name);
      }
    } catch (error) {
      console.error("Error fetching event:", error.response?.data || error.message);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.email) setEmail(user.email);
    fetchEvent();
  }, [fetchEvent]);

  const handleBuyTicket = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    if (!selectedTicketType) {
      alert("Please select a ticket type");
      return;
    }

    const selected = event.ticketTypes.find(t => t.name === selectedTicketType);
    if (!selected || selected.quantity <= 0) {
      alert("Selected ticket is sold out");
      return;
    }

    setProcessing(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/payments/pay`, {
        eventId: id,
        email: email.trim(),
        ticketType: selectedTicketType
      });

      const { url, data: paymentData } = response.data;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = url;

      Object.keys(paymentData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      // Note: form.submit() navigates away, so setProcessing(false) won't execute

    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Failed to initiate payment");
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="event-details-container"><p>Loading event details...</p></div>;
  }

  if (!event) {
    return (
      <div className="event-details-container">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <p>Event not found or invalid event ID.</p>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      <button className="back-btn" onClick={() => navigate("/")}>← Back</button>

      <div className="event-details-content">
        <div className="event-info">
          <h1>{event.title}</h1>
          <p className="event-description">{event.description}</p>

          <div className="event-meta">
            <div className="meta-item">
              <strong>📅 Date</strong>
              <p>{new Date(event.date).toLocaleString()}</p>
            </div>
            <div className="meta-item">
              <strong>📍 Location</strong>
              <p>{event.location}</p>
            </div>
          </div>
        </div>

        <div className="checkout-card">
          <h3>Select Your Ticket</h3>

          <div className="ticket-options">
            {event.ticketTypes?.map((ticket, index) => (
              <div
                key={ticket.name || index} // IMPROVED: Fallback to index if name is missing
                className={`ticket-option ${selectedTicketType === ticket.name ? "selected" : ""}`}
                onClick={() => setSelectedTicketType(ticket.name)}
              >
                <div className="ticket-info">
                  <strong>{ticket.name} Ticket</strong>
                  <p className="ticket-price">R {ticket.price?.toFixed(2) || "0.00"}</p>
                </div>
                <div className="ticket-quantity">{ticket.quantity} left</div>
              </div>
            ))}
          </div>

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
            disabled={processing || !selectedTicketType}
          >
            {processing 
              ? "Redirecting to PayFast..." 
              : `Buy ${selectedTicketType} Ticket`
            }
          </button>

          <p className="disclaimer">
            You will be redirected to PayFast to complete your payment securely.
          </p>
        </div>
      </div>
    </div>
  );
}
