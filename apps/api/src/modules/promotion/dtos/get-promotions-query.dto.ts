import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetPromotionsQueryDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
 
  @ApiPropertyOptional({ example: 'Amazon' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 'Amazon' })
  @IsOptional()
  @IsString()
  merchant?: string;

  @ApiPropertyOptional({ example: '2026-02-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  expiresBefore?: string;
}
