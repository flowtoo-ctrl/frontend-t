import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentCancelled.css';

export default function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <div className="payment-cancelled">
      <div className="cancelled-card">
        <div className="cancelled-icon">✕</div>
        <h1>Payment Cancelled</h1>
        <p>Your payment was not completed</p>

        <div className="cancelled-message">
          <p>
            Your payment has been cancelled. No charges have been made to your
            account.
          </p>
        </div>

        <div className="button-group">
          <button onClick={() => navigate('/')}>Back to Events</button>
          <button onClick={() => window.history.back()}>Try Again</button>
        </div>
      </div>
    </div>
  );
}