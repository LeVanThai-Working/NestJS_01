import { SetMetadata } from '@nestjs/common';
import { ResponseCode } from '../enums/response-code.enum.js';

export const RESPONSE_CODE_KEY = 'responseCode';

export const ResponseMessage = (code: ResponseCode) =>
  SetMetadata(RESPONSE_CODE_KEY, code);
