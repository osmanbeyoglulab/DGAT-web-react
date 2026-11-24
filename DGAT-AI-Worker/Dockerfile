# ---- Base Image ----
FROM python:3.11-slim

# Add this to prevent apt-get from hanging on prompts
ARG DEBIAN_FRONTEND=noninteractive

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

# Forcefully replace every instance of 17434 with 11535 in the DGAT python files
RUN find /app -name "*.py" -exec sed -i 's/17434/11535/g' {} +

# ---- Install Python Dependencies (CPU-only) ----
# 1. Increase timeout to 1000 seconds
# 2. Install CPU-only PyTorch FIRST to prevent it from pulling the massive GPU versions
RUN pip install --default-timeout=1000 --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu \
    && pip install --default-timeout=1000 --no-cache-dir -r requirements_CPU.txt \
    && pip install --default-timeout=1000 --no-cache-dir fastapi uvicorn python-multipart azure-storage-blob

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