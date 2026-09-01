import { SetMetadata } from '@nestjs/common';
import { ResponseCode } from '../enums/response-code.enum.js';
import { Role } from '../enums/role.enum.js';
import { COMMON_CONSTANTS } from '../constants/common.constants.js';

export const Roles = (...roles: Role[]) =>
  SetMetadata(COMMON_CONSTANTS.ROLE_KEY, roles);
