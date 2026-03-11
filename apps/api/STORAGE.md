# Photo Storage Service

Service for storing product photos with MinIO support (local development) and Cloudflare R2 (production).

## Architecture

### Photo Types

- **photoMain** - main product photo (required)
- **photoNutrition** - Nutrition Facts photo (optional)
- **photoIngredients** - ingredients photo (optional)

## Quick Setup

### 0. Install MinIO Client (one-time setup)

```bash
# Option 1: Using Homebrew (recommended)
brew install minio/stable/mc

# Option 2: Direct download
curl https://dl.min.io/client/mc/release/darwin-amd64/mc -o /usr/local/bin/mc
chmod +x /usr/local/bin/mc
```

### 1. Start MinIO

```bash
# Start MinIO container
docker-compose up -d minio

# Setup bucket (run once)
./scripts/minio/setup.sh
```

### 2. Upload Sample Images to MinIO

```bash
# Upload sample product images to MinIO
./scripts/minio/seed.sh
```

This will:

- Setup MinIO bucket and configure access
- Upload sample product images directly to MinIO

### 3. Install Dependencies

```bash
cd apps/api
npm install
```

### 4. Start API

```bash
cd apps/api
npm run dev
```

### MinIO Console Access

- **URL**: http://localhost:9001
- **Username**: minioadmin
- **Password**: minioadmin

### Local Development (MinIO)

```bash
# Run MinIO in Docker
docker run -d \
  --name minio \
  -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

### Production (Cloudflare R2)

- Public bucket with CDN
- Direct URLs without signing
- Automatic compression via Cloudflare

## API Endpoints

### Upload Photo

```http
POST /storage/upload
Content-Type: multipart/form-data

{
  "file": <image file>
}

Response:
{
  "filename": "uuid-timestamp.jpg",
  "url": "http://localhost:9000/photos/uuid-timestamp.jpg"
}
```

### Update Product

```http
PUT /product/:barcode
Content-Type: application/json

{
  "name": "Product Name",
  "photoMain": "uuid-timestamp.jpg",
  "photoNutrition": "uuid2-timestamp.jpg",
  "photoIngredients": "uuid3-timestamp.jpg"
}
```

### Get Photo URL

```http
GET /storage/:filename

Response:
{
  "url": "http://localhost:9000/photos/filename.jpg"
}
```

## Configuration

### .env file

```env
# Storage configuration
STORAGE_TYPE=minio  # minio | r2
STORAGE_ENDPOINT=http://localhost:9000
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
STORAGE_BUCKET=photos
STORAGE_REGION=us-east-1

# CDN configuration
CDN_BASE_URL=http://localhost:9000/photos
```

### For Production

```env
STORAGE_TYPE=r2
STORAGE_ENDPOINT=https://your-account.r2.cloudflarestorage.com
STORAGE_ACCESS_KEY=your-r2-access-key
STORAGE_SECRET_KEY=your-r2-secret-key
STORAGE_BUCKET=your-bucket-name
STORAGE_REGION=auto

CDN_BASE_URL=https://cdn.yourdomain.com
```

## Workflow

1. **Product Scanning**
   - User scans barcode
   - Check if product exists

2. **Photo Upload**
   - Main photo uploaded via `/storage/upload`
   - Receive filename in response

3. **Product Creation/Update**
   - Product created/updated via `PUT /product/:barcode`
   - Specify filename in corresponding field

4. **Photo Display**
   - Client gets URL via `/storage/:filename`
   - Or builds URL directly using CDN_BASE_URL

## File Validation

- **Formats**: JPG, PNG, WebP
- **Size**: maximum 10MB
- **Resolution**: maximum 4096x4096px
- **Filenames**: UUID + timestamp for uniqueness

## Security

- MIME type validation
- File extension verification
- Upload size limits
- Unique filename generation

## Development Scripts

### Setup with Sample Images

```bash
# Upload sample product images to MinIO
./scripts/minio/seed.sh
```

This script will:

1. Setup MinIO bucket and configure access
2. Upload sample product images directly to MinIO

### Individual Scripts

```bash
# Setup MinIO bucket only
./scripts/minio/setup.sh

# Upload sample images to MinIO
./scripts/minio/seed.sh
```

### Sample Products

| Product            | Image File                 | Source   |
| ------------------ | -------------------------- | -------- |
| Coca-Cola 0.5L     | placeholder-coca-cola.webp | Unsplash |
| Sprite 0.5L        | placeholder-sprite.png     | Unsplash |
| Lay's Classic 150g | placeholder-lays.webp      | Unsplash |
| Nutella 350g       | placeholder-nutella.webp   | Unsplash |
| Milk 2.5% 1L       | placeholder-milk.webp      | Unsplash |
| Mellenu zefirs     | placeholder-zefirs.png     | Unsplash |

Images are stored in `scripts/minio/images/` and uploaded directly to MinIO via the seed script.
