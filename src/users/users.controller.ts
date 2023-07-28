import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Query } from '@nestjs/common';
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

  // Delete user by id
  @Delete("delete-user-by-id")
  deleteUserById(@Query("id") userId:Number){
    return this.usersService.deleteUserById(Number(userId))
  }

  // Get user by user_id
  @Get("get-user-by-id/:user_id")
  getUserById(@Query("id") userId: number) {
    return this.usersService.getUserById(+userId); 
  }
  
}
