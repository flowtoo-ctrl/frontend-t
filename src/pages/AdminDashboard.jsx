import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchTickets();
    fetchEvents();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/admin/stats`);
    setStats(res.data);
  };

  const fetchTickets = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/admin/tickets`);
    setTickets(res.data);
  };

  const fetchEvents = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/admin/events`);
    setEvents(res.data);
  };

  return (
    <div className="admin-container">

      {/* HEADER */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="admin-content">

        {/* STATS */}
        <div className="stats">
          <div className="card">
            <h3>Total Events</h3>
            <p>{stats.totalEvents}</p>
          </div>

          <div className="card">
            <h3>Tickets Sold</h3>
            <p>{stats.totalTickets}</p>
          </div>

          <div className="card">
            <h3>Revenue</h3>
            <p>R {stats.totalRevenue}</p>
          </div>
        </div>

        {/* EVENTS */}
        <h2 className="section-title">Events</h2>
        <div className="table">
          <div className="row header">
            <p>Title</p>
            <p>Tickets Left</p>
            <p>Price</p>
            <p>Status</p>
          </div>

          {events.map(e => (
            <div key={e._id} className="row">
              <p>{e.title}</p>
              <p>{e.ticketsAvailable}</p>
              <p>R {e.price}</p>
              <p>
                {e.ticketsAvailable > 0 ? "Available" : "Sold Out"}
              </p>
            </div>
          ))}
        </div>

        {/* TICKETS */}
        <h2 className="section-title">Tickets</h2>
        <div className="table">
          <div className="row header">
            <p>Event</p>
            <p>Email</p>
            <p>Payment ID</p>
            <p>Status</p>
          </div>

          {tickets.map(t => (
            <div key={t._id} className="row">
              <p>{t.event?.title}</p>
              <p>{t.buyerEmail}</p>
              <p>{t.paymentId}</p>
              <p className="status-paid">{t.status}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}