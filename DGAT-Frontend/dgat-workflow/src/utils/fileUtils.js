// src/utils/fileUtils.js

/**
 * Splits an array of files into smaller batches based on a max size limit.
 * @param {File[]} filesArray - Array of File objects
 * @param {number} maxBatchSizeMB - Maximum size of a batch in Megabytes
 * @returns {File[][]} Array of batches (each batch is an array of files)
 */
export const chunkFiles = (filesArray, maxBatchSizeMB = 5) => {
  const batches = [];
  let currentBatch = [];
  let currentBatchSize = 0;
  const MAX_BYTES = maxBatchSizeMB * 1024 * 1024;

  filesArray.forEach((file) => {
    if (currentBatchSize + file.size > MAX_BYTES && currentBatch.length > 0) {
      batches.push(currentBatch);
      currentBatch = [];
      currentBatchSize = 0;
    }
    currentBatch.push(file);
    currentBatchSize += file.size;
  });

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
};