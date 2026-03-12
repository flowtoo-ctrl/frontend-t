import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EventDetails.css";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/${id}`
      );

      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.email) {
      setEmail(user.email);
    }

    fetchEvent();
  }, [fetchEvent]);

  const handleBuyTicket = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    setProcessing(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.post(
        "http://localhost:5000/api/payments/buy",
        {
          eventId: id,
          email: email,
          userId: user?._id || null
        }
      );

      const { paymentData, endpoint } = response.data;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = endpoint;

      Object.keys(paymentData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="event-details-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-container">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <div className="event-details-content">
        <div className="event-info">
          <h1>{event.title}</h1>

          <p className="event-description">
            {event.description || "No description available"}
          </p>

          <div className="event-meta">
            <div className="meta-item">
              <strong>📅 Date</strong>
              <p>
                {event.date
                  ? new Date(event.date).toLocaleString()
                  : "TBA"}
              </p>
            </div>

            <div className="meta-item">
              <strong>📍 Location</strong>
              <p>{event.location || "Unknown location"}</p>
            </div>

            <div className="meta-item">
              <strong>💰 Price</strong>
              <p>
                {event.price
                  ? `R ${event.price.toFixed(2)}`
                  : "Free"}
              </p>
            </div>

            <div className="meta-item">
              <strong>🎫 Tickets Available</strong>
              <p>{event.ticketsAvailable ?? "Unlimited"}</p>
            </div>
          </div>
        </div>

        <div className="checkout-card">
          <h3>Purchase Ticket</h3>

          <div className="price">
            {event.price ? `R ${event.price.toFixed(2)}` : "Free"}
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
            disabled={processing || event.ticketsAvailable <= 0}
          >
            {processing ? "Processing..." : "Proceed to Payment"}
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