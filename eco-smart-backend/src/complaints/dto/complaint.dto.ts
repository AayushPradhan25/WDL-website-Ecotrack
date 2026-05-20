import { IsString, IsNumber, IsOptional, Min, Max, IsEnum } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  category?: string;
}

export class UpdateComplaintStatusDto {
  @IsEnum(['pending', 'in-progress', 'resolved', 'rejected'])
  status: string;
}
