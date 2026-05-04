export interface RecognitionStartResponseDto {
  jobId: string;
  filename: string;
  url: string;
  status: "pending";
  createdAt: Date;
}
