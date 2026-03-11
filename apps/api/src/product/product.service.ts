import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { StorageService } from "../storage/storage.service";
import { CreateProductDto, UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async getByBarcode(barcode: string) {
    const product = await this.prisma.product.findUnique({
      where: { barcode },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return this.transformProductWithUrls(product);
  }

  async create(data: CreateProductDto) {
    return await this.prisma.product.create({
      data: data,
    });
  }

  async update(barcode: string, data: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { barcode },
      data: data,
    });
  }

  private transformProductWithUrls(product: any) {
    return {
      ...product,
      photoMain: this.storageService.getFileUrl(product.photoMain),
      photoNutrition: product.photoNutrition
        ? this.storageService.getFileUrl(product.photoNutrition)
        : null,
      photoIngredients: product.photoIngredients
        ? this.storageService.getFileUrl(product.photoIngredients)
        : null,
    };
  }
}
