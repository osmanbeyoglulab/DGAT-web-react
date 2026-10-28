import os
import time
from azure.storage.queue import QueueClient
from azure.storage.blob import BlobClient

# Get these from Environment Variables (which we will pass via Azure Container Apps)
CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
QUEUE_NAME = os.getenv("AZURE_QUEUE_NAME", "dgat-analysis-queue")
CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME", "raw-uploads")

# Initialize Clients
queue_client = QueueClient.from_connection_string(CONNECTION_STRING, QUEUE_NAME)

def process_file(blob_name):
    print(f"Downloading {blob_name} for analysis...")
    # 1. Download the file
    blob_client = BlobClient.from_connection_string(CONNECTION_STRING, CONTAINER_NAME, blob_name)
    with open(f"/tmp/{blob_name}", "wb") as my_blob:
        download_stream = blob_client.download_blob()
        my_blob.write(download_stream.readall())

    print("Running AI Analysis...")
    # 2. YOUR AI MODEL LOGIC GOES HERE
    # e.g., model.predict(f"/tmp/{blob_name}")
    time.sleep(5) # Simulating AI processing time
    
    print(f"Analysis complete for {blob_name}")

def main():
    print("AI Worker started. Polling queue...")
    while True:
        # Look for messages in the queue
        messages = queue_client.receive_messages(messages_per_page=1, visibility_timeout=300)
        
        for msg in messages:
            try:
                # The message is a JSON string containing the blob_name
                import json
                data = json.loads(msg.content)
                blob_name = data.get("blobName")
                
                if blob_name:
                    process_file(blob_name)
                    
                    # Delete the message ONLY after successful processing
                    queue_client.delete_message(msg)
                    print(f"Message for {blob_name} deleted from queue.")
                    
            except Exception as e:
                print(f"Error processing message: {e}")
                # Message will become visible again after visibility_timeout
        
        time.sleep(3) # Wait a few seconds before polling again

if __name__ == "__main__":
    main()