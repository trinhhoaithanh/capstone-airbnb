import { Controller, Get, Post, Body, Patch, Param, Delete,HttpCode} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaClient } from '@prisma/client';
import { ApiProperty, ApiTags } from '@nestjs/swagger/dist';
import { loginType, userType } from './dto/auth.dto';


@ApiTags('Auth')
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
  
  // Login Bad
  @Post("/login")
  login(@Body() body:loginType){
    return this.authService.login(body);
  }

  
  
}
