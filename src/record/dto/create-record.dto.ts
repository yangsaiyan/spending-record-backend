import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateRecordDto {
  @IsNumber()
  amount: number;

  @IsString()
  category: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;
}
