import { Type } from 'class-transformer';
import { IsOptional, IsDate, IsArray, IsString, IsNumber } from 'class-validator';

export class RecordFilterDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  category?: number[] | string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  limit?: number = 5;

  @IsOptional()
  @IsNumber()
  page?: number = 1;
}
