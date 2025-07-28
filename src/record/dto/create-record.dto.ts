import { IsNumber, IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

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

  @IsOptional()
  @IsBoolean()
  isMonthly?: boolean;

  @IsOptional()
  @IsDateString()
  lastTriggeredDate?: string;
}
