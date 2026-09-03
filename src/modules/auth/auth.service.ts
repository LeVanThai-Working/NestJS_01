import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/request/create-user.dto.js';
import { AppException } from '../../common/exceptions/app.exception.js';
import { ResponseCode } from '../../common/enums/response-code.enum.js';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../users/repositories/user.repository.js';
import { LoginDto } from './dto/request/login.dto.js';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { Role } from '../../common/enums/role.enum.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // 1. Hàm sinh cả 2 Token
  private async generateTokens(userId: string, email: string, role: Role) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>(
          'JWT_ACCESS_TOKEN_SECRET',
        ),
        expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ||
          '15m') as StringValue,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>(
          'JWT_REFRESH_TOKEN_SECRET',
        ),
        expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ||
          '7d') as StringValue,
      }),
    ]);
    return { accessToken, refreshToken };
  }
  // 2. Hash và lưu Refresh Token vào DB
  private async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ) {
    const hashedRefreshToken = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  // 3. Validate user
  async validateUser(email: string, password: string) {
    const findUser = await this.userRepository.findByEmailWithPassword(email);

    if (!findUser) {
      throw new AppException(
        ResponseCode.INVALID_EMAIL_OR_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatched = await bcrypt.compare(password, findUser.password);

    if (!passwordMatched) {
      throw new AppException(
        ResponseCode.INVALID_EMAIL_OR_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return findUser;
  }

  // 4. Register
  async register(createUserDto: CreateUserDto) {
    this.logger.log(`Registering user with email: ${createUserDto.email}`);

    return this.usersService.create(createUserDto);
  }

  // 5. Login
  async login(loginDto: LoginDto) {
    this.logger.log(`Logging in user with email: ${loginDto.email}`);

    const user = await this.validateUser(loginDto.email, loginDto.password);
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  // 6. Hàm Refresh Token
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userRepository.findByIdWithRefreshToken(userId);
    if (!user || !user.refreshToken) {
      throw new AppException(
        ResponseCode.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new AppException(
        ResponseCode.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken); // Token rotation
    return tokens;
  }

  // 7. Hàm Logout
  async logout(userId: string) {
    await this.updateRefreshToken(userId, null);
    return { success: true };
  }
}
