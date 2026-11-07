// src/pages/ProcessingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFileUploader } from '../hooks/useFileUploader';

const BACKEND_URL = 'http://localhost:3001'; // Your local backend

export default function ProcessingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  const rawFiles = location.state?.files || [];
  const userEmail = location.state?.email || 'test@example.com';
  const userName = location.state?.name || 'User';
  
  console.log("ProcessingPage mounted. Files received:", rawFiles);

  // Use our custom hook for chunking and uploading
  const { currentBatch, totalBatches, isUploading, uploadComplete, error } = useFileUploader(rawFiles, userEmail, 5);
  
  useEffect(() => {
    const runSimulation = async () => {
      await new Promise(r => setTimeout(r, 1000)); setStep(1);

      // Wait for the file uploader hook to finish its job
      if (isUploading) {
        setStep(2); // "File posted to db_newFile"
        return; // The hook will trigger a re-render when done
      }

      if (uploadComplete) {
        setStep(3); // "Decision: is new file?"
        await new Promise(r => setTimeout(r, 1500));
        setStep(4); // "Analyze data"
        await new Promise(r => setTimeout(r, 2000));
        setStep(5);
        await new Promise(r => setTimeout(r, 1500));
        setStep(6);
        await new Promise(r => setTimeout(r, 1000));
        setStep(7);
        await new Promise(r => setTimeout(r, 1500));
        setStep(8);
        
        await new Promise(r => setTimeout(r, 800));

        // await fetch('http://localhost:3001/api/analyze/complete', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     email: userEmail, // Get this from location.state
        //     fileName: rawFiles[0]?.name || 'Document',
        //     results: "Analysis completed successfully via DGAT simulation."
        //   })
        // });
        //final step

        navigate('/success');
        //now opens to success page 

      }
    };

    runSimulation();
  }, [navigate, isUploading, uploadComplete]);

  const steps = [
    "Prep files to send to db (Backend)",
    "File posted to db_newFile (Database)",
    "Decision: is new file? -> Yes (DGAT)",
    "Analyze data (DGAT)",
    "Document: final analysis results",
    "File posted to db_analyzed (Database)",
    "Decision: new file added -> Yes (Backend)",
    "Email send procedure (Backend)",
  ];

  return (
    <div className="card processing-card">
      <h2>Processing Workflow...</h2>
      
      {/* Visual indicator using data from the custom hook */}
      {totalBatches > 0 && isUploading && (
        <div className="batch-indicator">
          📦 Uploading Batch {currentBatch} of {totalBatches}...
        </div>
      )}

      <ul className="tracker-list">
        {steps.map((s, index) => (
          <li key={index} className={step >= index + 1 ? 'active' : ''}>
            {step > index + 1 ? '✅' : step === index + 1 ? '⏳' : '⚪'} {s}
          </li>
        ))}
      </ul>
    </div>
  );
}