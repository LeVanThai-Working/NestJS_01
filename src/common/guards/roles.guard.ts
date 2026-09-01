import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum.js';
import { COMMON_CONSTANTS } from '../constants/common.constants.js';
import { AppException } from '../exceptions/app.exception.js';
import { ResponseCode } from '../enums/response-code.enum.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lấy danh sách roles yêu cầu từ Metadata (@Roles)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      COMMON_CONSTANTS.ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu endpoint không yêu cầu role cụ thể nào, cho phép đi qua
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 2. Lấy thông tin user từ request (được gán từ JwtAuthGuard / JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new AppException(ResponseCode.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    // 3. Kiểm tra xem role của user có nằm trong danh sách requiredRoles không
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new AppException(ResponseCode.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
