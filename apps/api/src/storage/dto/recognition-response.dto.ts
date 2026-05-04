export interface MainPhotoRecognition {
  name: string;
  brand: string;
}

export interface RecognizedData {
  photoType: "main" | "nutrition" | "ingredients";
  data: MainPhotoRecognition | any;
  processingTime: number;
  timestamp: string;
}

export interface RecognitionResponseDto {
  filename: string;
  url: string;
  uploadedAt: Date;
  recognizedData: RecognizedData;
}
