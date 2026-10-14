// backend/azure/blobService.js
const { 
  BlobServiceClient, 
  generateBlobSASQueryParameters, 
  BlobSASPermissions, 
  SASProtocol,
  StorageSharedKeyCredential 
} = require('@azure/storage-blob');

async function generateUploadSasToken(containerName, blobName) {
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure the container exists
    await containerClient.createIfNotExists();

    const startsOn = new Date();
    const expiresOn = new Date(startsOn.valueOf() + 15 * 60 * 1000); // 15 mins

    // Extract Account Name and Key directly from the connection string
    const accountNameMatch = connectionString.match(/AccountName=([^;]+)/i);
    const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/i);

    if (!accountNameMatch || !accountKeyMatch) {
      throw new Error("Invalid AZURE_STORAGE_CONNECTION_STRING format in .env");
    }

    const accountName = accountNameMatch[1];
    const accountKey = accountKeyMatch[1];

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

    const sasOptions = {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("racw"), 
      startsOn,
      expiresOn,
      protocol: SASProtocol.HttpsAndHttp // Critical for local Azurite!
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions, 
      sharedKeyCredential
    ).toString();

    const blobUrl = `${containerClient.getBlockBlobClient(blobName).url}?${sasToken}`;
    
    console.log(`✅ Generated SAS token for: ${blobName}`);
    return { blobUrl, blobName };

  } catch (error) {
    console.error("❌ Error inside generateUploadSasToken:", error.message);
    throw error; // Re-throw so the API route catches it and returns a 500
  }
}

module.exports = { generateUploadSasToken };