// azure/queueService.js
const { QueueServiceClient } = require('@azure/storage-queue');
const { response } = require('express');

async function enqueueAnalysisTask(blobName, userEmail, originalFileName) {
  try {


    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const queueName = process.env.AZURE_QUEUE_NAME || 'dgat-analysis-queue';

    // Initialize the client
    const queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);
    const queueClient = queueServiceClient.getQueueClient(queueName);

    // Ensure the queue exists
    await queueClient.createIfNotExists();

    // The message payload (must be Base64 encoded for Azure Queue Storage)
    const messagePayload = {
      blobName,
      userEmail,
      originalFileName: originalFileName || blobName,
      timestamp: new Date().toISOString()
    };
    
    const messageString = JSON.stringify(messagePayload);
    const response = await queueClient.sendMessage(messageString); 

    console.log(`Enqueued analysis task for: ${blobName}`);
    return response;
  }
  catch (error) {
    console.error(`❌ [QueueService] Failed to enqueue task:`, error.message);
    throw error; // Throw the error so the server.js catch block catches it
  }
}

module.exports = { enqueueAnalysisTask };