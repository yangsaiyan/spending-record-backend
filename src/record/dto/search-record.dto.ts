import { Type } from 'class-transformer';
import { IsOptional, IsDate, IsArray, IsString } from 'class-validator';

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
}
