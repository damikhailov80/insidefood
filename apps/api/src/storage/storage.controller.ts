import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
} from "@nestjs/swagger";
import { StorageService } from "./storage.service";

@ApiTags("storage")
@Controller("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post("upload")
  @ApiOperation({ summary: "Upload a photo file" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiOkResponse({
    description: "File uploaded successfully",
    schema: {
      type: "object",
      properties: {
        filename: { type: "string" },
        url: { type: "string" },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    try {
      this.storageService.validateFile(file);
      return await this.storageService.uploadFile(file);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(":filename")
  @ApiOperation({ summary: "Get photo URL by filename" })
  @ApiOkResponse({
    description: "Photo URL retrieved",
    schema: {
      type: "object",
      properties: {
        url: { type: "string" },
      },
    },
  })
  getFileUrl(@Param("filename") filename: string) {
    return {
      url: this.storageService.getFileUrl(filename),
    };
  }
}
