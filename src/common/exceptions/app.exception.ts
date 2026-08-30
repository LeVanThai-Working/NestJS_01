import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseCode } from '../enums/response-code.enum.js';
import { RESPONSE_MESSAGES } from '../constants/response-message.constants.js';

export class AppException extends HttpException {
  constructor(
    code: ResponseCode,
    status: HttpStatus,
    message?: string,
    data: unknown = null,
  ) {
    super(
      {
        code,
        message: message ?? RESPONSE_MESSAGES[code],
        data,
      },
      status,
    );
  }
}
