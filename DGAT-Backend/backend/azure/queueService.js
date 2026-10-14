// azure/queueService.js
const { QueueServiceClient } = require('@azure/storage-queue');

async function enqueueAnalysisTask(blobName, userEmail, originalFileName) {
  const queueServiceClient = QueueServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  const queueClient = queueServiceClient.getQueueClient(process.env.AZURE_QUEUE_NAME);

  // Ensure the queue exists
  await queueClient.createIfNotExists();

  // The message payload (must be Base64 encoded for Azure Queue Storage)
  const messagePayload = {
    blobName,
    userEmail,
    originalFileName,
    status: 'PENDING_ANALYSIS',
    timestamp: new Date().toISOString()
  };

  const messageString = JSON.stringify(messagePayload);
  const base64Message = Buffer.from(messageString).toString('base64');

  // Send the message to the queue
  await queueClient.sendMessage(base64Message);
  
  console.log(`Enqueued analysis task for: ${blobName}`);
}

module.exports = { enqueueAnalysisTask };