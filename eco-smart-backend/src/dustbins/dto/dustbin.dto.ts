import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';

export class CreateDustbinDto {
  @IsString()
  location: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UpdateDustbinDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Min(100)
  fillLevel?: number;

  @IsOptional()
  @IsEnum(['active', 'full', 'maintenance', 'inactive'])
  status?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
