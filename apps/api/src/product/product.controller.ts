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
import { ProductService } from "./product.service";
import { UpdateProductDto, CreateProductDto } from "./dto/update-product.dto";

@ApiTags("product")
@ApiTags("product")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(":barcode")
  @ApiOperation({ summary: "Get product by barcode" })
  @ApiOkResponse({ description: "Product found" })
  @ApiNotFoundResponse({ description: "Product not found" })
  async getByBarcode(@Param("barcode") barcode: string) {
    return await this.productService.getByBarcode(barcode);
  }

  @Post()
  @ApiOperation({ summary: "Create new product" })
  @ApiOkResponse({ description: "Product created successfully" })
  @ApiConflictResponse({
    description: "Product with this barcode already exists",
  })
  async createProduct(@Body() data: CreateProductDto) {
    try {
      return await this.productService.create(data);
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
      return await this.productService.update(barcode, data);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "P2025") {
        throw new NotFoundException("Product not found");
      }
      throw error;
    }
  }
}
