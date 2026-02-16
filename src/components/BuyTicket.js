import React from 'react';

const BuyTicket = ({ event }) => {
  const handleBuy = async () => {
    const email = prompt('Enter your email:');
    if (!email) return;

    const res = await fetch('/api/payments/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: event._id, email })
    });
    const { redirectUrl } = await res.json();
    window.location.href = redirectUrl;
  };

  return (
    <div style={{ marginTop: '20px', border: '2px solid green', padding: '15px' }}>
      <h2>Buy Ticket for {event.title}</h2>
      <p>Price: R{event.price}</p>
      <button onClick={handleBuy} style={{ background: 'green', color: 'white', padding: '10px' }}>Proceed to PayFast</button>
    </div>
  );
};

export default BuyTicket;

