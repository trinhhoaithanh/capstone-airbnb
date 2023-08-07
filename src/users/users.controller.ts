import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Query,Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer'; 
import { FileUploadDto } from './dto/fileUploadDto.dto';

@ApiTags("Users")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get users 
  @Get("get-users")
  getUsers() {
    return this.usersService.getUsers(); 
  }

  // Create a user
  @Post("create-user")
  createUser(@Body() user:User){
    return this.usersService.createUser(user);
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

  // Get user by user_name
  @Get("get-user-by-name/:user_name")
  getUserByName(@Query("full_name") userName: string) {
    return this.usersService.getUserByName(userName); 
  }

  // Update user
  @ApiHeader({
    name: 'token',
    description: 'Your authentication token', 
    required: true, 
  })
  @Put("update-user")
  updateUser(@Headers("token") token, @Body() userUpdate:UpdateUserDto){
    return this.usersService.updateUser(token, userUpdate);
  }

  // Upload user's avatar
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: FileUploadDto})
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/img",
      filename: (req, file, callback) => {
        callback(null, new Date().getTime() + file.originalname)
      }
    })
  }))
  @ApiHeader({
    name: 'token',
    description: 'Your authentication token', 
    required: true, 
  })
  @Post("upload-avatar")
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Headers("token") token) {
    return this.usersService.uploadAvatar(token, file); 
  }

}
