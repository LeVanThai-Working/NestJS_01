import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/request/create-user.dto.js';
import { UpdateUserDto } from '../dto/request/update-user.dto.js';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    return this.userRepository.save(user);
  }

  async update(id: string, user: UpdateUserDto): Promise<User | null> {
    const findUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!findUser) {
      return null;
    }

    return this.userRepository.save({ ...findUser, ...user });
  }

  async delete(id: string): Promise<boolean> {
    const findUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!findUser) {
      return false;
    }

    const result = await this.userRepository.delete(id);
    return result.affected !== 0;
  }
}
