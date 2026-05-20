import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateTruckDto {
  @IsString()
  number: string;

  @IsString()
  driverName: string;
}

export class UpdateTruckDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  driverName?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'maintenance', 'on-route'])
  status?: string;
}

export class UpdateTruckLocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class AddTruckLogDto {
  @IsString()
  message: string;
}
