import { Module } from "@nestjs/common";
import { RecognitionService } from "./recognition.service";
import { RecognitionController } from "./recognition.controller";
import { StorageModule } from "../storage/storage.module";

@Module({
  imports: [StorageModule],
  controllers: [RecognitionController],
  providers: [RecognitionService],
  exports: [RecognitionService],
})
export class RecognitionModule {}
