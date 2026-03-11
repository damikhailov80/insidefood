import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { PrismaService } from "../prisma.service";
import { StorageService } from "../storage/storage.service";

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, StorageService],
})
export class ProductModule {}
