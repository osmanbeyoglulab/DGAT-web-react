import React from 'react';

export default function AboutPage() {
  return (
    <div className="card">
      <h2>About the DGAT System</h2>
      <p>
        Welcome to the Document and Graph Analysis Tool (DGAT). This system is designed to streamline 
        the submission, secure storage, and automated analysis of complex documents.
      </p>
      <p>
        Built using modern web technologies including React, Node.js, and Azure Cloud Services, 
        the platform leverages a Pattern B architecture to ensure high scalability and security 
        by uploading files directly to storage via SAS tokens.
      </p>
      <p>
        Our goal is to provide a seamless pipeline from document ingestion to actionable AI-driven insights.
      </p>
    </div>
  );
}