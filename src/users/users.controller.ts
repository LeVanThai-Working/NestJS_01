import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/request/create-user.dto.js';
import { UpdateUserDto } from './dto/request/update-user.dto.js';
import { ResponseMessage } from '../common/decorators/response-message.decorator.js';
import { ResponseCode } from '../common/enums/response-code.enum.js';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/request/pagination-query.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-access-auth.guard.js';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ResponseMessage(ResponseCode.USER_FOUND)
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.usersService.findAll(paginationQueryDto);
  }

  @Get(':id')
  @ResponseMessage(ResponseCode.USER_FOUND)
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Get('email/:email')
  @ResponseMessage(ResponseCode.USER_FOUND)
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post()
  @ResponseMessage(ResponseCode.USER_CREATED)
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Patch(':id')
  @ResponseMessage(ResponseCode.USER_UPDATED)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() user: UpdateUserDto) {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  @ResponseMessage(ResponseCode.USER_DELETED)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id);
  }
}
