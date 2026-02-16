import React, { useState } from 'react';

const CreateEvent = ({ onEventCreated }) => {
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', price: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const newEvent = await res.json();
    onEventCreated(newEvent);
    setForm({ title: '', description: '', date: '', location: '', price: '' });
  };

  return (
    <div>
      <h2>Create Event (Organizer)</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <input type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
        <input placeholder="Location e.g. Pretoria CBD" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
        <input type="number" placeholder="Price (R)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateEvent;

