# DGAT-Queue-Worker/worker.py
import os
import time
import json
import requests
from azure.storage.queue import QueueClient
from azure.storage.blob import BlobClient

# Environment Variables
CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
QUEUE_NAME = os.getenv("AZURE_QUEUE_NAME", "dgat-analysis-queue")
CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME", "raw-uploads")
DGAT_API_URL = os.getenv("DGAT_API_URL", "http://dgat-ai-worker:80/analyze")
BACKEND_URL = os.getenv("BACKEND_URL", "http://host.docker.internal:3001")

queue_client = QueueClient.from_connection_string(CONNECTION_STRING, QUEUE_NAME)

def main():
    # --- ADDED QUEUE CREATION LOGIC ---
    try:
        # Attempt to create the queue. 
        queue_client.create_queue()
        print(f"Created queue '{QUEUE_NAME}'.")
    except Exception as e:
        # It will likely throw an error if it already exists, which is fine.
        print(f"Queue '{QUEUE_NAME}' already exists or could not be created. Proceeding...")
    # ----------------------------------

    print(f"Queue Worker started. Listening to '{QUEUE_NAME}'...")
    
    while True:
        try:
            # Poll the queue
            messages = queue_client.receive_messages(messages_per_page=1, visibility_timeout=600)
            
            for msg in messages:
                try:
                    data = json.loads(msg.content)
                    blob_name = data.get("blobName")
                    user_email = data.get("userEmail")
                    
                    if blob_name:
                        print(f"Processing {blob_name}...")
                        
                        # 1. Download the file from Blob Storage
                        blob_client = BlobClient.from_connection_string(CONNECTION_STRING, CONTAINER_NAME, blob_name)
                        file_data = blob_client.download_blob().readall()
                        
                        # 2. Send file to the DGAT API Container
                        files = {'file': (blob_name, file_data, 'application/octet-stream')}
                        response = requests.post(DGAT_API_URL, files=files)
                        response.raise_for_status() # Check for HTTP errors
                        
                        analysis_results = response.json()
                        print(f"✅ Analysis complete for {blob_name}")

                        # 3. Trigger the Email Notification (via your Node Backend)
                        email_payload = {
                            "email": user_email,
                            "fileName": blob_name,
                            "simulatedResults": str(analysis_results)
                        }
                        try:
                            requests.post(f"{BACKEND_URL}/api/analyze/complete", json=email_payload)
                            print("✅ Email notification triggered.")
                        except Exception as email_err:
                            print(f"⚠️ Failed to trigger email, but analysis succeeded: {email_err}")

                        # 4. Delete the message only after everything succeeds
                        queue_client.delete_message(msg)
                        print(f"Message deleted from queue.")
                        
                except Exception as e:
                    print(f"❌ Error processing message: {e}")
                    # The message will become visible again after visibility_timeout
            
            # Wait a few seconds before polling again to prevent spamming the emulator
            time.sleep(3) 

        except Exception as loop_error:
            print(f"❌ Error polling queue: {loop_error}")
            time.sleep(5) # Wait a bit longer if there's a connection error

if __name__ == "__main__":
    main()