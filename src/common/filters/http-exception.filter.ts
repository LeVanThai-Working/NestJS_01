import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { ResponseCode } from '../enums/response-code.enum.js';
import { RESPONSE_MESSAGES } from '../constants/response-message.constants.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ResponseCode.INTERNAL_SERVER_ERROR;
    let message = RESPONSE_MESSAGES[ResponseCode.INTERNAL_SERVER_ERROR];
    let data: unknown = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const errorResponse = exceptionResponse as Record<string, unknown>;

        if (typeof errorResponse.code === 'string') {
          code = errorResponse.code as ResponseCode;
        }

        if (typeof errorResponse.message === 'string') {
          message = errorResponse.message;
        }

        if (errorResponse.data !== undefined) {
          data = errorResponse.data;
        }
      }

      if (status === HttpStatus.BAD_REQUEST) {
        code =
          code === ResponseCode.INTERNAL_SERVER_ERROR
            ? ResponseCode.INVALID_REQUEST
            : code;
      }

      if (status === HttpStatus.UNAUTHORIZED) {
        code = ResponseCode.UNAUTHORIZED;
      }

      if (status === HttpStatus.FORBIDDEN) {
        code = ResponseCode.FORBIDDEN;
      }

      if (status === HttpStatus.NOT_FOUND) {
        // Don't override a custom business code.
        if (code === ResponseCode.INTERNAL_SERVER_ERROR) {
          code = ResponseCode.INVALID_REQUEST;
        }
      }
    }

    // --- LOGGING ---
    const logContext = `${request.method} ${request.url}`;
    if (status >= 500) {
      // 5xx errors: Log full error and stack trace
      const stack =
        exception instanceof Error
          ? exception.stack
          : JSON.stringify(exception);
      this.logger.error(`[${status}] ${message} - ${logContext}`, stack);
    } else {
      // 4xx errors: Log as warning for tracking invalid requests/auth failures
      this.logger.warn(`[${status}] ${message} - ${logContext}`);
    }

    response.status(status).json({
      success: false,
      code,
      message,
      data,
    });
  }
}
