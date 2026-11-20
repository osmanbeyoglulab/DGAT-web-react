# serve.py
from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
import os
import time
import traceback
import numpy as np
import scanpy as sc
import torch
import pandas as pd
import random

# --- Import DGAT specific modules ---
# These come from the cloned repo in /app
try:
    from utils.Preprocessing import preprocess_ST, fill_genes
    from Model.Train_and_Predict import protein_predict
except ImportError as e:
    print(f"Warning: Could not import DGAT modules. Error: {e}")


app = FastAPI(title="DGAT Inference API")

# Global variables for common genes/proteins
common_gene = []
common_protein = []

# IMPORTANT: These paths match the structure created by entrypoint.sh and download_model.py
model_save_dir = "/app/models/11535_gene_31_protein"
pyg_save_dir = "/tmp/pyg_data"

@app.on_event("startup")
def startup_event():
    global common_gene, common_protein

    print("⏳ Initializing DGAT environment...")
    
    # SET SEEDS (From the notebook)
    seed = 2025
    torch.manual_seed(seed)
    np.random.seed(seed)
    random.seed(seed)

    try: 
        # Load the required lists to ensure prediction input matches training data
        with open("/app/resources/common_gene_17434.txt", "r") as f: 
            common_gene = [line.strip() for line in f]

        with open("/app/resources/common_protein_31.txt", "r") as f: 
            common_protein = [line.strip() for line in f]
            
        # Ensure the PyG cache directory exists
        os.makedirs(pyg_save_dir, exist_ok=True)

        print(f"✅ Loaded {len(common_gene)} genes and {len(common_protein)} proteins.")
        print(f"✅ Model directory set to: {model_save_dir}")
        print("✅ Server ready to accept inference requests.")

        
    except Exception as e:
        print(f"❌ Failed to load resources: {traceback.format_exc()}")

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):



    
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    if not file.filename.endswith('.h5ad'):
        raise HTTPException(status_code=400, detail="Only .h5ad files are supported for DGAT analysis.")
    
    # Save uploaded file temporarily
    temp_file_path = f"/tmp/{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        print(f"⬇️ Received file: {file.filename}")
        start_time = time.time()


        print(f"Running analysis on {file.filename}...")
        # --- REPLACE WITH ACTUAL DGAT INFERENCE CODE ---
        # results = model.predict(temp_file_path)
        
        # mock results set in line below
        results = {"summary": "This is a fake result", "score": 0.95}
        
        return {"filename": file.filename, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temp file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)