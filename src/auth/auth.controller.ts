import { Controller, Get, Post, Body, Patch, Param, Delete,HttpCode} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaClient } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger/dist';
class userType{

  
  @ApiProperty()
  email:String;

  @ApiProperty()
  pass_word:String;

  @ApiProperty()
  full_name:String;

  @ApiProperty()
  birth_day:String;

  @ApiProperty()
  gender:Boolean;

  @ApiProperty()
  user_role:String;

  @ApiProperty()
  phone:String;



}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  prisma = new PrismaClient();
  
  // Sign up 
  @HttpCode(201)
  @Post("/sign-up")
  signUp(@Body() body:userType){
    return this.authService.signUp(body);
  } 
  
  // Login 
  @Post("/login")
  login(@Body() body){
    return this.authService.login(body);
  }

  
  
}
