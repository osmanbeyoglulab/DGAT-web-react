// src/hooks/useFileUploader.js
import { useState, useEffect } from 'react';
import { chunkFiles } from '../utils/fileUtils';

const BACKEND_URL = 'http://localhost:3001'; // Replace with your Azure App Service URL in production

export const useFileUploader = (files, userEmail = 'user@example.com', maxSizeMB = 5) => {
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!files || files.length === 0) return;

    const uploadAllBatches = async () => {
      setIsUploading(true);
      setError(null);
      
      // 1. Calculate batches
      const batches = chunkFiles(files, maxSizeMB);
      setTotalBatches(batches.length);

      try {
        // 2. Loop through each batch and upload sequentially
        for (let i = 0; i < batches.length; i++) {
          setCurrentBatch(i + 1);
          const batch = batches[i];

          for (const file of batch) {
            // Step A: Ask backend for permission (SAS Token)
            const initResponse = await fetch(`${BACKEND_URL}/api/upload/init`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fileName: file.name, fileSize: file.size })
            });
            
            if (!initResponse.ok) throw new Error('Failed to get upload URL');
            const { uploadUrl, blobName } = await initResponse.json();

            // Step B: Upload file DIRECTLY to Azure Blob Storage
            const uploadResponse = await fetch(uploadUrl, {
              method: 'PUT',
              headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type || 'application/octet-stream'
              },
              body: file
            });

            if (!uploadResponse.ok) throw new Error(`Failed to upload ${file.name} to Azure`);

            // Step C: Notify backend that upload is complete
            const completeResponse = await fetch(`${BACKEND_URL}/api/upload/complete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                blobName, 
                userEmail, 
                originalFileName: file.name 
              })
            });

            if (!completeResponse.ok) throw new Error('Failed to notify backend of completion');
          }
        }

        setIsUploading(false);
        setUploadComplete(true);

      } catch (err) {
        console.error("Upload error:", err);
        setError(err.message);
        setIsUploading(false);
      }
    };

    uploadAllBatches();
  }, [files, maxSizeMB, userEmail]);

  return { currentBatch, totalBatches, isUploading, uploadComplete, error };
};