import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import "./CreateEvent.css";

export default function CreateEvent() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [tickets, setTickets] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateEvent = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("location", location);
      formData.append("price", Number(price));
      formData.append("ticketsAvailable", Number(tickets));
      formData.append("initialTickets", Number(tickets));

      if (image) {
        formData.append("image", image);
      }

      await axios.post(`${API_BASE_URL}/api/events`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Event created successfully");

      navigate("/");

    } catch (err) {

      console.error(err);
      setError(err.response?.data?.error || "Failed to create event");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="create-event-container">

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <div className="create-event-card">

        <h2>Create Event</h2>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleCreateEvent}>

          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Ticket Price (R)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Total Tickets</label>
            <input
              type="number"
              value={tickets}
              onChange={(e) => setTickets(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Event Poster</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>

        </form>

      </div>

    </div>

  );
}