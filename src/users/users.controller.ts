import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Users")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get users 
  @Get("get-users")
  getUsers() {
    return this.usersService.getUsers(); 
  }
}
