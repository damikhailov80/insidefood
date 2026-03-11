export interface StorageConfig {
  type: "minio" | "r2";
  endpoint: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  region: string;
  cdnBaseUrl: string;
}

export const getStorageConfig = (): StorageConfig => {
  const requiredEnvVars = [
    "STORAGE_ENDPOINT",
    "STORAGE_ACCESS_KEY",
    "STORAGE_SECRET_KEY",
    "STORAGE_BUCKET",
    "CDN_BASE_URL",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    type: (process.env.STORAGE_TYPE as "minio" | "r2") || "minio",
    endpoint: process.env.STORAGE_ENDPOINT!,
    accessKey: process.env.STORAGE_ACCESS_KEY!,
    secretKey: process.env.STORAGE_SECRET_KEY!,
    bucket: process.env.STORAGE_BUCKET!,
    region: process.env.STORAGE_REGION || "us-east-1",
    cdnBaseUrl: process.env.CDN_BASE_URL!,
  };
};
