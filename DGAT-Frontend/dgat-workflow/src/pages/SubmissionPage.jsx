// src/pages/SubmissionPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubmissionPage() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) return setError('Validation Failed: Please enter your name.');
    if (!email.trim() || !email.includes('@')) return setError('Validation Failed: Please enter a valid email.');
    if (!file || file.length === 0) return setError('Validation Failed: Please select a document.');

    setError('');
    
    // Navigate to processing page and pass the data along
    // Make sure you are converting the FileList to an Array!
    navigate('/processing', { 
    state: { 
        name, 
        email, 
        files: Array.from(file) // <--- Ensure this says Array.from
    } 
    });
  };

  return (
    <div className="card">
      <h2>Fill Out Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Upload Document:</label>
          <input type="file" multiple onChange={(e) => setFile(e.target.files)} />
        </div>
        {error && <p className="error-text">{error}</p>}
        
        <button type="submit" className="btn-primary">Submit</button>
        <button type="button" onClick={() => navigate('/')} className="btn-secondary" style={{ marginTop: '10px' }}>Back to Home</button>
      </form>
    </div>
  );
}