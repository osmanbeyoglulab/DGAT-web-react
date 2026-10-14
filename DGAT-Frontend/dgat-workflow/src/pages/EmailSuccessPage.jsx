// src/pages/EmailSuccessPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmailSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="card success-card">
      <h2>Email recieved</h2>
      <p>The submission workflow is complete.</p>
      <button onClick={() => navigate('/')} className="btn-secondary">Start Over</button>
    </div>
  );
}