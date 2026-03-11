import { ApiProperty, PartialType, OmitType } from "@nestjs/swagger";

export class CreateProductDto {
  @ApiProperty()
  barcode: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  energy: number;

  @ApiProperty()
  fat: number;

  @ApiProperty()
  fat_saturated: number;

  @ApiProperty()
  carbs: number;

  @ApiProperty()
  sugars: number;

  @ApiProperty()
  protein: number;

  @ApiProperty()
  salt: number;

  @ApiProperty({ required: false })
  fiber?: number;

  @ApiProperty({ description: "Main product photo filename" })
  photoMain: string;

  @ApiProperty({
    required: false,
    description: "Nutrition facts photo filename",
  })
  photoNutrition?: string;

  @ApiProperty({
    required: false,
    description: "Ingredients photo filename",
  })
  photoIngredients?: string;
}

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ["barcode"]),
) {}
