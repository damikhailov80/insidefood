import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiConflictResponse,
} from "@nestjs/swagger";
import { PrismaService } from "../prisma.service";
import { UpdateProductDto, CreateProductDto } from "./dto/update-product.dto";

@ApiTags("product")
@Controller("product")
export class ProductController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(":barcode")
  @ApiOperation({ summary: "Get product by barcode" })
  @ApiOkResponse({ description: "Product found" })
  @ApiNotFoundResponse({ description: "Product not found" })
  async getByBarcode(@Param("barcode") barcode: string) {
    const product = await this.prisma.product.findUnique({
      where: { barcode },
    });
    if (!product) throw new NotFoundException();
    return product;
  }

  @Post()
  @ApiOperation({ summary: "Create new product" })
  @ApiOkResponse({ description: "Product created successfully" })
  @ApiConflictResponse({
    description: "Product with this barcode already exists",
  })
  async createProduct(@Body() data: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: data,
      });
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "P2002") {
        throw new ConflictException("Product with this barcode already exists");
      }
      throw error;
    }
  }

  @Put(":barcode")
  @ApiOperation({ summary: "Update existing product by barcode" })
  @ApiOkResponse({ description: "Product updated successfully" })
  @ApiNotFoundResponse({ description: "Product not found" })
  async updateProduct(
    @Param("barcode") barcode: string,
    @Body() data: UpdateProductDto,
  ) {
    try {
      return await this.prisma.product.update({
        where: { barcode },
        data: data,
      });
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "P2025") {
        throw new NotFoundException("Product not found");
      }
      throw error;
    }
  }
}
