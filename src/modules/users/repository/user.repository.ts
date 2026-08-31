import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/request/create-user.dto.js';
import { UpdateUserDto } from '../dto/request/update-user.dto.js';
import { PaginationQueryDto } from '../../../common/dto/request/pagination-query.dto.js';
import { PaginatedResult } from '../../../common/types/paginated-result.type.js';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResult<User>> {
    const { page, limit, sortBy, order } = paginationQueryDto;
    const skip = (page - 1) * limit;
    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: {
        [sortBy]: order,
      },
    });
    return {
      data: users,
      total,
    };
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  //just using for JWT validate
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password') // Ép lấy thêm trường password
      .getOne();
  }

  async findByIdWithRefreshToken(id: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.refreshToken') // Ép lấy thêm trường refreshToken
      .getOne();
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
