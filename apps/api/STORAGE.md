# Photo Storage Service

Service for storing product photos with MinIO support (local development) and Cloudflare R2 (production).

## Architecture

### Photo Types

- **photoMain** - main product photo (required)
- **photoNutrition** - Nutrition Facts photo (optional)
- **photoIngredients** - ingredients photo (optional)

## Quick Setup

### 1. Start MinIO

```bash
# Start MinIO container
docker-compose up -d minio

# Setup bucket (run once)
./scripts/setup-minio.sh
```

### 2. Install Dependencies

```bash
cd apps/api
npm install
```

### 3. Run Database Migration

```bash
cd apps/api
npx prisma migrate dev --name add-photo-fields
```

### 4. Start API

```bash
cd apps/api
npm run dev
```

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
