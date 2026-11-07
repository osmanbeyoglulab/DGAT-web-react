# serve.py
from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
import os

app = FastAPI(title="DGAT Inference API")

# 1. Load the model ONCE when the container starts
# Update this path to where the Zenodo zip extracted the model
MODEL_PATH = "/app/DGAT_pretrained_models/model.h5" 
model = None

@app.on_event("startup")
def startup_event():
    global model
    print("Loading DGAT model into memory...")

    ##### Major update 
    # --- REPLACE WITH ACTUAL DGAT MODEL LOADING CODE ---
    # model = dgat.load_model(MODEL_PATH)
    model = "Mock Model Loaded"


    
    print("Model loaded successfully!")

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Save uploaded file temporarily
    temp_file_path = f"/tmp/{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        print(f"Running analysis on {file.filename}...")
        # --- REPLACE WITH ACTUAL DGAT INFERENCE CODE ---
        # results = model.predict(temp_file_path)
        results = {"summary": "This is a fake result", "score": 0.95}
        
        return {"filename": file.filename, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temp file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)