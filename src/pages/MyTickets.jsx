import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import "./MyTickets.css";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/tickets/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTickets(sorted);

      } catch (err) {
        console.error(err);
      }
    };

    fetchTickets();
  }, [navigate]);

  return (
    <div className="my-tickets-container">
      <h1>My Tickets</h1>

      {tickets.map(ticket => (
        <div key={ticket._id} className="ticket-card">
          <h3>{ticket.event?.title}</h3>

          <p>Date: {new Date(ticket.event?.date).toLocaleString()}</p>
          <p>Location: {ticket.event?.location}</p>
          <p>Price: R {ticket.event?.price}</p>
          <p>Ticket ID: {ticket.paymentId}</p>
          <p>Status: {ticket.status}</p>

          {ticket.qrCode && <img src={ticket.qrCode} alt="QR" />}
        </div>
      ))}
    </div>
  );
}

