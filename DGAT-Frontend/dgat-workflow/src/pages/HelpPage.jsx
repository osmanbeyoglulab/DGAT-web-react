import React from 'react';

export default function HelpPage() {
  return (
    <div className="card">
      <h2>Help & Documentation</h2>
      
      <div style={{ marginTop: '1.5rem' }}>
        <h3>📄 How to submit a document</h3>
        <p>Navigate to the <strong>Submission</strong> tab. Fill in your name and email, select the files you wish to analyze, and click Submit. Large files are automatically chunked to prevent bandwidth issues.</p>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3>🔍 How to analyze results</h3>
        <p>Once your document has been processed by the AI model, you will receive an email notification. You can then navigate to the <strong>Analyze</strong> tab to search for and view your results.</p>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3>❓ Troubleshooting</h3>
        <p>If you experience issues uploading, ensure you have a stable internet connection and that your file format is supported (PDF, DOCX, TXT).</p>
      </div>
    </div>
  );
}