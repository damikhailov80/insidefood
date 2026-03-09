import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProductController],
  providers: [PrismaService],
})
export class ProductModule {}
