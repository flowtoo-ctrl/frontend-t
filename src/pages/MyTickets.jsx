import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyTickets.css";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTickets = useCallback(async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/tickets/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTickets(response.data || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setError("Failed to load tickets");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchTickets(token);
  }, [fetchTickets, navigate]);

  const downloadTicket = (ticket) => {
    if (!ticket.qrCode) return;

    const link = document.createElement("a");
    link.href = ticket.qrCode;
    link.download = `ticket-${ticket._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="my-tickets-container">
        <p>Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="my-tickets-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h1>My Tickets</h1>

      {error && <p className="error-msg">{error}</p>}

      {tickets.length === 0 ? (
        <div className="no-tickets">
          <p>You haven't purchased any tickets yet.</p>
          <button onClick={() => navigate("/")}>Browse Events</button>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <h3>{ticket.event?.title || "Event"}</h3>

              <p>
                <strong>Date:</strong>{" "}
                {ticket.event?.date
                  ? new Date(ticket.event.date).toLocaleString()
                  : "TBA"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {ticket.event?.location || "Unknown"}
              </p>

              <p>
                <strong>Price:</strong>{" "}
                {ticket.event?.price
                  ? `R ${ticket.event.price.toFixed(2)}`
                  : "Free"}
              </p>

              <p>
                <strong>Ticket ID:</strong> {ticket.paymentId}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="status-badge">{ticket.status}</span>
              </p>

              {ticket.qrCode && (
                <div className="qr-code">
                  <img src={ticket.qrCode} alt="QR Code" />
                </div>
              )}

              <button
                className="download-btn"
                onClick={() => downloadTicket(ticket)}
              >
                Download QR Code
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}