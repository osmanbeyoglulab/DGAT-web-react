import os
from azure.storage.blob import BlobServiceClient

CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
CONTAINER_NAME = "dgat-models"
LOCAL_DIR = "/app/models/11535_gene_31_protein"

MODEL_FILES = [
    "encoder_mRNA.pth",
    "encoder_protein.pth",
    "decoder_mRNA.pth",
    "decoder_protein.pth"
]

def download_models():
    # Check if models already exist (caching)
    if os.path.exists(os.path.join(LOCAL_DIR, MODEL_FILES[0])):
        print("✅ Models already exist in local cache. Skipping download.")
        return

    print("⏳ Models not found locally. Downloading from Azure Storage...")
    os.makedirs(LOCAL_DIR, exist_ok=True)
    
    try:
        blob_service_client = BlobServiceClient.from_connection_string(CONNECTION_STRING)
        container_client = blob_service_client.get_container_client(CONTAINER_NAME)

        for file_name in MODEL_FILES:
            print(f"Downloading {file_name}...")
            blob_client = container_client.get_blob_client(file_name)
            
            with open(os.path.join(LOCAL_DIR, file_name), "wb") as download_file:
                download_file.write(blob_client.download_blob().readall())
                
        print("✅ All models downloaded successfully.")
    except Exception as e:
        print(f"❌ Failed to download models: {e}")
        exit(1) # Exit with error so the container fails fast

if __name__ == "__main__":
    download_models()




