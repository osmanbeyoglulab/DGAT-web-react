// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { generateUploadSasToken } = require('./azure/blobService');
const { enqueueAnalysisTask } = require('./azure/queueService');
const { configureAzuriteCors } = require('./setCors'); 
const { sendAnalysisCompleteEmail } = require('./azure/emailService'); // <-- Import
const { QueueServiceClient } = require('@azure/storage-queue');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow your React app to communicate with this API
app.use(express.json()); // Parse incoming JSON payloads

// Route 1: Frontend asks for permission to upload a specific file
app.post('/api/upload/init', async (req, res) => {
  try {
    const { fileName, fileSize } = req.body;

    if (!fileName || !fileSize) {
      return res.status(400).json({ error: 'fileName and fileSize are required' });
    }

    // Generate a unique blob name to prevent overwriting files with the same name
    const uniqueBlobName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${fileName}`;

    // Get the secure SAS URL from Azure
    const { blobUrl } = await generateUploadSasToken(process.env.AZURE_CONTAINER_NAME, uniqueBlobName);

    res.status(200).json({ 
      uploadUrl: blobUrl, 
      blobName: uniqueBlobName 
    });

  } catch (error) {
    console.error('Error generating SAS token:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// Route 2: Frontend notifies the backend that the upload to Azure Blob Storage is complete
app.post('/api/upload/complete', async (req, res) => {
  try {
    const { blobName, userEmail, originalFileName } = req.body;

    if (!blobName || !userEmail) {
      return res.status(400).json({ error: 'blobName and userEmail are required' });
    }
    // Trigger the DGAT tool by sending a message to the queue
    await enqueueAnalysisTask(blobName, userEmail, originalFileName);

    res.status(200).json({ 
      success: true, 
      message: 'File successfully queued for analysis', 
    });

  } catch (error) {
    console.error('Error enqueueing task:', error);
    res.status(500).json({ error: 'Failed to queue file for analysis' });
  }
});

// Simulated endpoint to trigger the email (for local testing)
app.post('/api/analyze/complete', async (req, res) => {
  try {
    const { email, fileName, simulatedResults } = req.body;  //this is currently set to simulated results should just be results but will leave it as it 

    if (!email || !fileName) {
      return res.status(400).json({ error: 'email and fileName are required' });
    }

    // Mock AI analysis results for the demo
    const mockResults = simulatedResults || `Document processed successfully.\nAI Summary: This document appears to be a valid submission.\nConfidence Score: 98%`;

    // Send the email
    await sendAnalysisCompleteEmail(email, fileName, mockResults);

    res.status(200).json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('Error in /api/analyze/complete:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Start the server
app.listen(PORT, async () => { // <-- Make callback async
  console.log(`Backend API running on http://localhost:${PORT}`);
  await configureAzuriteCors(); // <-- Run CORS setup on startup
});