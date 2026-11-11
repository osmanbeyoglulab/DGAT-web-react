# ---- Base Image ----
FROM python:3.11-slim

# ---- System Dependencies ----
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libhdf5-dev \
    git \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# ---- Working Directory ----
WORKDIR /app

# ---- Clone DGAT Repository ----
RUN git clone https://github.com/osmanbeyoglulab/DGAT.git .

# ---- Install Python Dependencies (CPU-only) ----
# Install DGAT requirements AND your web server dependencies
RUN pip install --no-cache-dir -r requirements_CPU.txt \
    && pip install --no-cache-dir fastapi uvicorn python-multipart

# ---- Download and Extract Pretrained Model ----
RUN curl -L -o /tmp/DGAT_pretrained_models.zip \
    "https://zenodo.org/records/23896227/files/DGAT_pretrained_models.zip?download=1" \
    && unzip /tmp/DGAT_pretrained_models.zip -d /app/ \
    && rm /tmp/DGAT_pretrained_models.zip

# ---- Copy Your Inference Wrapper ----
COPY serve.py /app/serve.py

# ---- Expose the Port ----
EXPOSE 80

# ---- Start the API Server ----
CMD ["uvicorn", "serve:app", "--host", "0.0.0.0", "--port", "80"]