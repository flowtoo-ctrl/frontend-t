import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      navigate('/my-tickets');
    }
  }, [countdown, navigate]);

  return (
    <div className="payment-success">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Your ticket has been purchased</p>
        
        <div className="success-message">
          <p>Thank you for your purchase. Your ticket confirmation has been sent to your email address.</p>
          <p>Redirecting to your tickets in {countdown} seconds...</p>
        </div>

        <button onClick={() => navigate('/my-tickets')}>View My Tickets</button>
      </div>
    </div>
  );
}

