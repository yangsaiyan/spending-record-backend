import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateRecordDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  category: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;
}
