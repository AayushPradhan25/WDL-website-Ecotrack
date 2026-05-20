import { IsNumber, IsPositive } from 'class-validator';

export class AddCoinsDto {
  @IsNumber()
  @IsPositive()
  coins: number;
}
