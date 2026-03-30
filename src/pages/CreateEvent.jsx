import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import "./CreateEvent.css";

let nextTicketId = 3; // For unique IDs

export default function CreateEvent() {
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: "",
  });

  const [ticketTypes, setTicketTypes] = useState([
    { id: 1, name: "VIP", price: "", quantity: "" },
    { id: 2, name: "General", price: "", quantity: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // FIXED: Immutable update
  const handleTicketChange = (id, field, value) => {
    setTicketTypes(prev => prev.map(ticket => 
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    ));
  };

  const addTicketType = () => {
    setTicketTypes(prev => [
      ...prev, 
      { id: nextTicketId++, name: "", price: "", quantity: "" }
    ]);
  };

  const removeTicketType = (id) => {
    if (ticketTypes.length === 1) {
      setError("At least one ticket type is required");
      return;
    }
    setTicketTypes(prev => prev.filter(t => t.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.title || !formData.date || !formData.location) {
      setError("Please fill in Title, Date, and Location");
      setLoading(false);
      return;
    }

    // FIXED: Safe number parsing with validation
    const validTicketTypes = ticketTypes
      .filter(t => t.name.trim() && t.price && t.quantity)
      .map(t => {
        const price = parseFloat(t.price);
        const quantity = parseInt(t.quantity, 10); // FIXED: Added radix
        
        if (isNaN(price) || isNaN(quantity) || price < 0 || quantity < 1) {
          return null;
        }
        return {
          name: t.name.trim(),
          price,
          quantity
        };
      })
      .filter(Boolean);

    if (validTicketTypes.length === 0) {
      setError("Please add at least one valid ticket type");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user.id && !user._id) {
        setError("You must be logged in to create an event");
        setLoading(false);
        return;
      }

      const eventPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        location: formData.location.trim(),
        image: formData.image.trim(),
        ticketTypes: validTicketTypes,
      };

      abortControllerRef.current = new AbortController();

      const response = await axios.post(
        `${API_BASE_URL}/api/events`,
        eventPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          signal: abortControllerRef.current.signal,
        }
      );

      // Use non-blocking notification instead of alert
      navigate(`/event/${response.data._id}`, { 
        state: { message: "Event created successfully!" } 
      });

    } catch (err) {
      if (axios.isCancel(err)) return;
      
      console.error("Create event error:", err.response?.data || err.message);
      setError(
        err.response?.data?.error || 
        "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Events
      </button>

      <div className="create-event-card">
        <h1>Create New Event</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Annual Tech Conference 2026"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event in detail..."
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date & Time *</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Sandton Convention Centre, Johannesburg"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Event Image URL (optional)</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label className="ticket-section-label">
              Ticket Types *
            </label>

            {ticketTypes.map((ticket) => (
              <div key={ticket.id} className="ticket-type-row">
                <input
                  type="text"
                  placeholder="Ticket Name (e.g. VIP)"
                  value={ticket.name}
                  onChange={(e) => handleTicketChange(ticket.id, "name", e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Price (R)"
                  value={ticket.price}
                  onChange={(e) => handleTicketChange(ticket.id, "price", e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
                <input
                  type="number"
                  placeholder="Available Quantity"
                  value={ticket.quantity}
                  onChange={(e) => handleTicketChange(ticket.id, "quantity", e.target.value)}
                  min="1"
                  required
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeTicketType(ticket.id)}
                  aria-label="Remove ticket type"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              className="add-ticket-btn"
              onClick={addTicketType}
            >
              + Add Another Ticket Type
            </button>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Creating Event..." : "Create & Publish Event"}
          </button>
        </form>
      </div>
    </div>
  );
}


