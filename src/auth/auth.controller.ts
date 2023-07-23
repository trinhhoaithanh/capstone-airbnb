import { Controller, Get, Post, Body, Patch, Param, Delete,HttpCode} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaClient } from '@prisma/client';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  prisma = new PrismaClient();
  
  // Sign up 
  @Post("/sign-up")
  signUp(@Body() body){
    return this.authService.signUp(body);
  } 
  
  // Login 
  @Post("/login")
  login(@Body() body){
    return this.authService.login(body);
  }

  
  
}
