import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

export interface RecognitionJob {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  photoType: "main" | "nutrition" | "ingredients";
  filename: string;
  url: string;
  createdAt: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

@Injectable()
export class RecognitionService {
  private jobs = new Map<string, RecognitionJob>();

  async startRecognition(
    filename: string,
    url: string,
    photoType: "main" | "nutrition" | "ingredients",
  ): Promise<string> {
    const jobId = uuidv4();

    const job: RecognitionJob = {
      id: jobId,
      status: "pending",
      photoType,
      filename,
      url,
      createdAt: new Date(),
    };

    this.jobs.set(jobId, job);

    this.processRecognitionAsync(jobId);

    return jobId;
  }

  getJobStatus(jobId: string): RecognitionJob | null {
    return this.jobs.get(jobId) || null;
  }

  private async processRecognitionAsync(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = "processing";
    this.jobs.set(jobId, job);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 + Math.random() * 3000),
      );

      let result: any;
      if (job.photoType === "main") {
        result = {
          name: "Recognized Product Name",
          brand: "Recognized Brand",
        };
      } else {
        result = {};
      }

      job.status = "completed";
      job.completedAt = new Date();
      job.result = result;
      this.jobs.set(jobId, job);
    } catch (error) {
      job.status = "failed";
      job.error = error instanceof Error ? error.message : "Unknown error";
      this.jobs.set(jobId, job);
    }
  }
}
