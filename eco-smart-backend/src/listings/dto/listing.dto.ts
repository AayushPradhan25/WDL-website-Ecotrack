import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateListingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsInt()
  @Min(1)
  price: number;

  @IsString()
  quantity: string;
}

export class UpdateListingDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsOptional()
  buyerId?: number;
}
