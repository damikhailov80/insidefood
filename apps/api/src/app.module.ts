import { Module } from "@nestjs/common";
import { ProductModule } from "./product/product.module";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [ProductModule, StorageModule],
})
export class AppModule {}
