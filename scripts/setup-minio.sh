#!/bin/bash

# Setup script for MinIO bucket creation
echo "Setting up MinIO bucket..."

# Wait for MinIO to be ready
echo "Waiting for MinIO to start..."
sleep 5

# Install MinIO client if not present
if ! command -v mc &> /dev/null; then
    echo "Installing MinIO client..."
    curl https://dl.min.io/client/mc/release/darwin-amd64/mc \
      --create-dirs \
      -o $HOME/minio-binaries/mc
    chmod +x $HOME/minio-binaries/mc
    export PATH=$PATH:$HOME/minio-binaries/
fi

# Configure MinIO client
mc alias set local http://localhost:9000 minioadmin minioadmin

# Create bucket
mc mb local/photos --ignore-existing

# Set public read policy for the bucket
mc anonymous set public local/photos

echo "MinIO setup complete!"
echo "Access MinIO Console at: http://localhost:9001"
echo "Username: minioadmin"
echo "Password: minioadmin"