import { IsString, IsOptional } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  dayOfWeek: string;

  @IsString()
  time: string;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  activityType?: string;

  @IsOptional()
  truckId?: number;
}

export class UpdateScheduleDto {
  @IsString()
  @IsOptional()
  dayOfWeek?: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsOptional()
  truckId?: number;
}
