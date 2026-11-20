#!/bin/bash
set -e

# 1. Download the model weights from Azure Storage (or use the local cache)
python /app/download_model.py

# 2. Start the FastAPI Server
echo "🚀 Starting Uvicorn Server..."
exec uvicorn serve:app --host 0.0.0.0 --port 80