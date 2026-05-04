import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
} from "@nestjs/swagger";
import { RecognitionService } from "./recognition.service";
import { StorageService } from "../storage/storage.service";

@ApiTags("recognition")
@Controller("recognition")
export class RecognitionController {
  constructor(
    private readonly recognitionService: RecognitionService,
    private readonly storageService: StorageService,
  ) {}

  @Post("start")
  @ApiOperation({ summary: "Start image recognition" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        photoType: {
          type: "string",
          enum: ["main", "nutrition", "ingredients"],
        },
      },
    },
  })
  @ApiOkResponse({
    description: "Recognition started successfully",
    schema: {
      type: "object",
      properties: {
        jobId: { type: "string" },
        filename: { type: "string" },
        url: { type: "string" },
        status: { type: "string", enum: ["pending"] },
        createdAt: { type: "string", format: "date-time" },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async startRecognition(
    @UploadedFile() file: Express.Multer.File,
    @Body("photoType") photoType?: "main" | "nutrition" | "ingredients",
  ) {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    try {
      // Загружаем файл временно для распознавания
      const uploadResult = await this.storageService.uploadTemporary(file);

      // Запускаем распознавание
      const jobId = await this.recognitionService.startRecognition(
        uploadResult.filename,
        uploadResult.url,
        photoType || "main",
      );

      return {
        jobId,
        filename: uploadResult.filename,
        url: uploadResult.url,
        status: "pending",
        createdAt: uploadResult.uploadedAt,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : "Recognition failed",
      );
    }
  }

  @Get(":jobId")
  @ApiOperation({ summary: "Get recognition job status" })
  @ApiOkResponse({
    description: "Recognition job status retrieved",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        status: {
          type: "string",
          enum: ["pending", "processing", "completed", "failed"],
        },
        photoType: { type: "string" },
        filename: { type: "string" },
        url: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        completedAt: { type: "string", format: "date-time" },
        result: { type: "object" },
        error: { type: "string" },
      },
    },
  })
  getRecognitionStatus(@Param("jobId") jobId: string) {
    const job = this.recognitionService.getJobStatus(jobId);
    if (!job) {
      throw new BadRequestException("Job not found");
    }
    return job;
  }
}
