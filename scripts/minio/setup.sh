#!/bin/bash

# Setup script for MinIO bucket creation
echo "Setting up MinIO bucket..."

# Wait for MinIO to be ready
echo "Waiting for MinIO to start..."
sleep 5

# Check if MinIO client is installed
if ! command -v mc &> /dev/null; then
    echo "MinIO client (mc) not found!"
    echo "Please install it first:"
    echo "  brew install minio/stable/mc"
    echo "  or"
    echo "  curl https://dl.min.io/client/mc/release/darwin-amd64/mc -o /usr/local/bin/mc && chmod +x /usr/local/bin/mc"
    exit 1
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