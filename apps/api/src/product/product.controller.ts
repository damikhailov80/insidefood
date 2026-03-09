import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma.service';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':barcode')
  @ApiOperation({ summary: 'Get product by barcode' })
  @ApiOkResponse({ description: 'Product found' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async getByBarcode(@Param('barcode') barcode: string) {
    const product = await this.prisma.product.findUnique({ where: { barcode } });
    if (!product) throw new NotFoundException();
    return product;
  }
}
