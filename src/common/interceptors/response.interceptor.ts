import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { ApiResponseDto } from '../dto/response/api-response.dto.js';
import { ResponseCode } from '../enums/response-code.enum.js';
import { RESPONSE_MESSAGES } from '../constants/response-message.constants.js';
import { RESPONSE_CODE_KEY } from '../decorators/response-message.decorator.js';
import { PaginatedResponse } from '../dto/response/paginated-response.dto.js';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponseDto<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the controller already returned an ApiResponseDto,
        // don't wrap it again.
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'code' in data &&
          'message' in data
        ) {
          return data as unknown as ApiResponseDto<T>;
        }

        // Read the response code from @ResponseMessage() decorator,
        // fallback to generic SUCCESS if not set.
        const code =
          this.reflector.get<ResponseCode>(
            RESPONSE_CODE_KEY,
            context.getHandler(),
          ) ?? ResponseCode.SUCCESS;

        // Handle paginated responses
        if (data instanceof PaginatedResponse) {
          return new ApiResponseDto(
            true,
            code,
            RESPONSE_MESSAGES[code],
            data.data as unknown as T,
            data.meta,
          );
        }

        return new ApiResponseDto(true, code, RESPONSE_MESSAGES[code], data);
      }),
    );
  }
}
