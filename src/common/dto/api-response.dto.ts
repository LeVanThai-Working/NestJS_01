import { ResponseCode } from '../enums/response-code.enum.js';

export class ApiResponseDto<T> {
  success: boolean;
  code: ResponseCode;
  message: string;
  data: T | null;

  constructor(
    success: boolean,
    code: ResponseCode,
    message: string,
    data: T | null,
  ) {
    this.success = success;
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
