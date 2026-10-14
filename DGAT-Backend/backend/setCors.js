// backend/setCors.js
const { BlobServiceClient } = require('@azure/storage-blob');

async function configureAzuriteCors() {
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString.includes('127.0.0.1')) return; // Only run for local Azurite

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    
    const corsRules = [
      {
        allowedOrigins: "http://localhost:5173,http://127.0.0.1:5173",
        allowedMethods: "GET,PUT,POST,OPTIONS,DELETE",
        allowedHeaders: "*",
        exposedHeaders: "*",
        maxAgeInSeconds: 3600
      }
    ];

    await blobServiceClient.setProperties({ cors: corsRules });
    console.log("✅ Azurite CORS rules configured successfully.");
  } catch (error) {
    console.error("❌ Failed to configure Azurite CORS:", error.message);
  }
}

module.exports = { configureAzuriteCors };