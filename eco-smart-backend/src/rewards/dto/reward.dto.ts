import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  coinsNeeded: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class RedeemRewardDto {
  // No additional fields needed - rewardId comes from param
}
