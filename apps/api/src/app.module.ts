import { Module } from "@nestjs/common";
import { ProductModule } from "./product/product.module";
import { StorageModule } from "./storage/storage.module";
import { RecognitionModule } from "./recognition/recognition.module";

@Module({
  imports: [ProductModule, StorageModule, RecognitionModule],
})
export class AppModule {}
