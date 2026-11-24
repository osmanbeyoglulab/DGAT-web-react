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
model_save_dir = "/app/models"
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
        with open("/app/resources/common_gene_11535.txt", "r") as f: 
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

    #confirm file type is .h5ad
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
        adata = sc.read_h5ad(temp_file_path)
        adata.var_names_make_unique()
        
        # Perform QC and normalization
        preprocess_ST(adata)
        
        # Fill in missing genes with zeros to match the training set
        adata = fill_genes(adata, common_gene)
        
        # 4. Run the prediction
        print("🤖 Running DGAT prediction (this may take a few minutes)...")

        # Inject dummy spatial metadata if it's missing
        if 'spatial' not in adata.uns:
            print("⚠️ Warning: 'spatial' metadata missing. Injecting dummy data.")
            adata.uns['spatial'] = {'dummy_sample': {}}
            
        if 'name' not in adata.uns:
            print("⚠️ Warning: 'name' metadata missing. Injecting dummy name.")
            adata.uns['name'] = 'Breast_Sample'
        
        # protein_predict loads the .pth files from model_save_dir internally
        pred_adata = protein_predict(
            adata, 
            common_gene, 
            common_protein, 
            model_save_dir, 
            pyg_save_dir
        )

        processing_time = round(time.time() - start_time, 2)
        print(f"✅ Analysis complete in {processing_time} seconds.")
        
        # 5. Format the results
        # pred_adata is an AnnData object. We need to convert the predictions into a JSON-serializable format.
        # Assuming protein_predict stores results in .obsm (adjust if the notebook shows otherwise)
        # This extracts the first 5 spots as a sample to return to the frontend.
        sample_results = {}
        if 'protein_predictions' in pred_adata.obsm:
             # If it's a numpy array or dataframe
             df = pd.DataFrame(pred_adata.obsm['protein_predictions'], index=pred_adata.obs_names, columns=common_protein)
             sample_results = df.head(5).to_dict(orient="index")
        else:
             # Fallback if the exact key is different
             sample_results = {"status": "Prediction complete", "spots_processed": pred_adata.n_obs}
        
        # mock results set in line below
        # results = {"summary": "This is a fake result", "score": 0.95}
        
        return {
            "status": "success",
            "message": f"Analysis complete for {file.filename}",
            "processing_time_seconds": processing_time,
            "results_sample": sample_results
        }
    
    except Exception as e:
        print(f"❌ Error during analysis: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temp file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)