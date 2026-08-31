import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/request/login.dto.js';
import { CreateUserDto } from '../users/dto/request/create-user.dto.js';
import { JwtRefreshGuard } from './guards/jwt-refresh-auth.guard.js';
import { JwtAuthGuard } from './guards/jwt-access-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refreshTokens(
    @Req() req: Request & { user: { userId: string; refreshToken: string } },
  ) {
    return this.authService.refreshTokens(
      req.user.userId,
      req.user.refreshToken,
    );
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request & { user: { userId: string } }) {
    return this.authService.logout(req.user.userId);
  }
}
