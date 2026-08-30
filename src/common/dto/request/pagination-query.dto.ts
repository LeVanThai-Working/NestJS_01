import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SortBy, SortOrder } from '../../enums/sort-query.enum.js';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy = SortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  order = SortOrder.DESC;
}
