import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateTruckRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  preferredDate?: string;

  @IsString()
  @IsOptional()
  preferredTime?: string;
}

export class UpdateTruckRequestDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  adminNotes?: string;

  @IsOptional()
  estimatedArrival?: Date;
}
