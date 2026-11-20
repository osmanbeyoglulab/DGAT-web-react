# ---- Base Image ----
FROM python:3.11-slim

# ---- System Dependencies ----
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libhdf5-dev \
    libgl1 \
    libglib2.0-0 \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ---- Working Directory ----
WORKDIR /app

# ---- Clone DGAT Repository ----
RUN git clone https://github.com/osmanbeyoglulab/DGAT.git .

# ---- Install Python Dependencies (CPU-only) ----
# Install DGAT requirements AND your web server dependencies
RUN pip install --no-cache-dir -r requirements_CPU.txt \
    && pip install --no-cache-dir fastapi uvicorn python-multipart azure-storage-blob

# ---- Copy Your Inference Wrapper ----
COPY serve.py /app/serve.py
COPY download_model.py /app/download_model.py
COPY entrypoint.sh /app/entrypoint.sh

# ---- Make the entrypoint script executable ----
RUN chmod +x /app/entrypoint.sh

# ---- Expose the Port ----
EXPOSE 80

# ---- Executes the startup script ----
ENTRYPOINT ["/app/entrypoint.sh"]