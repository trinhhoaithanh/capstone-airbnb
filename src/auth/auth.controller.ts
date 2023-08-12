import {
  Controller,
  Post,
  Body,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger/dist';
import { loginType, userType } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  prisma = new PrismaClient();

  // Sign up
  @HttpCode(201)
  @Post('/sign-up')
  signUp(@Body() body: userType) {
    return this.authService.signUp(body);
  } 
  
  // Login
  @Post('/login')
  login(@Body() body: loginType) {
    return this.authService.login(body);
  }
}
