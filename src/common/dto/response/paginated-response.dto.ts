import { PaginationMeta } from '../../types/paginated-result.type.js';

/**
 * Wrapper that carries paginated data + meta through the interceptor.
 * The interceptor detects this class and extracts `meta` into ApiResponseDto.
 */
export class PaginatedResponse<T> {
  readonly data: T[];
  readonly meta: PaginationMeta;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
