// src/pages/AnalyzePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AnalyzePage() {
  const [viewState, setViewState] = useState('search'); 
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate(); // Initialize hook

  // ... (keep your existing handleSearchSubmit and executeBackendFlow functions exactly as they are) ...
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return setError('Validation Failed: Please enter a search term.');
    setError('');
    executeBackendFlow(query);
  };

  const executeBackendFlow = async (searchQuery) => {
    setViewState('loading');
    await new Promise(res => setTimeout(res, 1000)); 
    await new Promise(res => setTimeout(res, 1000)); 
    const mockDbData = [
      { id: 1, name: `Document_${searchQuery}_A.pdf`, status: 'Analyzed', score: 98 },
      { id: 2, name: `Document_${searchQuery}_B.pdf`, status: 'Analyzed', score: 85 },
    ];
    await new Promise(res => setTimeout(res, 800)); 
    setResults(mockDbData);
    setViewState('results'); 
  };

  if (viewState === 'loading') {
    return (
      <div className="card processing-card">
        <h2>Running Backend Command...</h2>
        <p>⏳ Fetching from db_analyzed and consolidating data...</p>
      </div>
    );
  }

  if (viewState === 'results') {
    return (
      <div className="card">
        <h2>Page Viewed: Analysis Results</h2>
        <div className="results-container">
          {results.map(item => (
            <div key={item.id} className="result-item">
              <h4>{item.name}</h4>
              <p>Status: {item.status} | Score: {item.score}%</p>
            </div>
          ))}
        </div>
        <button onClick={() => setViewState('search')} className="btn-primary" style={{marginTop: '1rem'}}>New Search</button>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{marginTop: '10px'}}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Go to Analyze Page</h2>
      <form onSubmit={handleSearchSubmit}>
        <div className="form-group">
          <label>Fill Out Search:</label>
          <input type="text" placeholder="Enter search criteria..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn-primary">Submit Search</button>
        <button type="button" onClick={() => navigate('/')} className="btn-secondary" style={{marginTop: '10px'}}>Back to Home</button>
      </form>
    </div>
  );
}