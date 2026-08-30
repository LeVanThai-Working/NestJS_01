import { ResponseCode } from '../../enums/response-code.enum.js';
import { PaginationMeta } from '../../types/paginated-result.type.js';

export class ApiResponseDto<T> {
  success: boolean;
  code: ResponseCode;
  message: string;
  data: T | null;
  meta?: PaginationMeta;

  constructor(
    success: boolean,
    code: ResponseCode,
    message: string,
    data: T | null,
    meta?: PaginationMeta,
  ) {
    this.success = success;
    this.code = code;
    this.message = message;
    this.data = data;

    if (meta) {
      this.meta = meta;
    }
  }
}
