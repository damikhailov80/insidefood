import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('product')
export class ProductController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':barcode')
  async getByBarcode(@Param('barcode') barcode: string) {
    const product = await this.prisma.product.findUnique({ where: { barcode } });
    if (!product) throw new NotFoundException();
    return product;
  }
}
