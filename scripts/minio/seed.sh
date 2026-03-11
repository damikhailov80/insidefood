#!/bin/bash

echo "Uploading sample images to MinIO..."

# Step 1: Setup MinIO bucket
echo "1. Setting up MinIO..."
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

# Step 2: Clear existing images
echo "2. Clearing existing images..."
mc rm local/photos/ --recursive --force || echo "No existing files to remove"

# Step 3: Upload images to MinIO
echo "3. Uploading images to MinIO..."
mc cp scripts/minio/images/* local/photos/

echo "✓ Images uploaded to MinIO!"
echo "Check MinIO console at http://localhost:9001 to see uploaded images."
echo "Images available at: http://localhost:9000/photos/"