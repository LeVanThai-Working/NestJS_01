import { ResponseCode } from '../enums/response-code.enum.js';

export const RESPONSE_MESSAGES: Record<ResponseCode, string> = {
  [ResponseCode.SUCCESS]: 'Request successful',
  [ResponseCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ResponseCode.INVALID_REQUEST]: 'Invalid request',

  [ResponseCode.UNAUTHORIZED]: 'Unauthorized',
  [ResponseCode.FORBIDDEN]: 'Forbidden',
  [ResponseCode.INVALID_EMAIL_OR_PASSWORD]: 'Invalid email or password',

  [ResponseCode.VALIDATION_ERROR]: 'Validation failed',

  [ResponseCode.USER_CREATED]: 'User created successfully',
  [ResponseCode.USER_FOUND]: 'User retrieved successfully',
  [ResponseCode.USER_UPDATED]: 'User updated successfully',
  [ResponseCode.USER_DELETED]: 'User deleted successfully',
  [ResponseCode.USER_NOT_FOUND]: 'User not found',
  [ResponseCode.USER_ALREADY_EXISTS]: 'User already exists',
};
