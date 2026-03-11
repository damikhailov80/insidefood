import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getStorageConfig, StorageConfig } from "../config/storage.config";

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private config: StorageConfig;

  constructor() {
    this.config = getStorageConfig();

    this.s3Client = new S3Client({
      endpoint: this.config.endpoint,
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretKey,
      },
      forcePathStyle: true, // Required for MinIO
    });
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ filename: string; url: string }> {
    const filename = this.generateFilename(file.originalname);

    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", // Make files publicly accessible
    });

    await this.s3Client.send(command);

    return {
      filename,
      url: this.getFileUrl(filename),
    };
  }

  getFileUrl(filename: string): string {
    return `${this.config.cdnBaseUrl}/${filename}`;
  }

  private generateFilename(originalName: string): string {
    const extension = originalName.split(".").pop();
    const timestamp = Date.now();
    const uuid = uuidv4();
    return `${uuid}-${timestamp}.${extension}`;
  }

  validateFile(file: Express.Multer.File): void {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(
        "Invalid file type. Only JPG, PNG, and WebP are allowed.",
      );
    }

    if (file.size > maxSize) {
      throw new Error("File too large. Maximum size is 10MB.");
    }
  }
}
