import React, { useState } from 'react';

export default function ExploreModelPage() {
  const [selectedModel, setSelectedModel] = useState('DGAT-v1');

  return (
    <div className="card">
      <h2>Explore the Models</h2>
      <p>Select an AI model below to view its capabilities and performance metrics.</p>
      
      <div className="form-group" style={{ marginTop: '1.5rem' }}>
        <label>Select Model:</label>
        <select 
          value={selectedModel} 
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
        >
          <option value="DGAT-v1">DGAT-v1 (Standard)</option>
          <option value="DGAT-v2">DGAT-v2 (Pro)</option>
          <option value="DGAT-Protein">DGAT-Protein (Specialized)</option>
        </select>
      </div>

      <div className="model-details" style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
        <h3>Model Details: {selectedModel}</h3>
        <ul>
          <li><strong>Accuracy:</strong> 98.5%</li>
          <li><strong>Latency:</strong> ~2.5 seconds per document</li>
          <li><strong>Supported Formats:</strong> PDF, PNG, JPG, TXT</li>
        </ul>
        <p>This model is optimized for extracting structured data and summarizing textual content.</p>
      </div>
    </div>
  );
}