import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags("Users")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get users 
  @ApiHeader({
    name: "tokenUser"
  })
  @Get("get-users")
  getUsers(@Headers("tokenUser") token) {
    return this.usersService.getUsers(token); 
  }
}
