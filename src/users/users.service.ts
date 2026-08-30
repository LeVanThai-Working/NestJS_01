import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository.js';
import { CreateUserDto } from './dto/request/create-user.dto.js';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/request/update-user.dto.js';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/response/user.dto.js';
import { AppException } from '../common/exceptions/app.exception.js';
import { ResponseCode } from '../common/enums/response-code.enum.js';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: string): Promise<UserResponseDto> {
    const findUser = await this.userRepository.findById(id);

    if (!findUser) {
      throw new AppException(ResponseCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return plainToInstance(UserResponseDto, findUser, {
      excludeExtraneousValues: true,
    });
  }

  async create(user: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await this.userRepository.create({
      ...user,
      password: hashedPassword,
    });

    return plainToInstance(UserResponseDto, createdUser, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, user: UpdateUserDto): Promise<UserResponseDto> {
    const updatedUser = await this.userRepository.update(id, user);

    if (!updatedUser) {
      throw new AppException(ResponseCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string) {
    const deletedUser = await this.userRepository.delete(id);

    if (!deletedUser) {
      throw new AppException(ResponseCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return plainToInstance(UserResponseDto, deletedUser, {
      excludeExtraneousValues: true,
    });
  }
}
