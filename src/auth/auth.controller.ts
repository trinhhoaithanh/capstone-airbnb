import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger/dist';
import { loginType, userType } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  prisma = new PrismaClient();

  // Signup
  @Post('signup')
  signUp(@Body() userSignup: userType) {
    return this.authService.signUp(userSignup);
  }
  
  // Signup for Admin
  @Post("register-admin")
  createAdmin(@Body() adminSignup: userType) {
    return this.authService.createAdmin(adminSignup); 
  }
  
  // Login
  @Post('login')
  login(@Body() userLogin: loginType) {
    return this.authService.login(userLogin);
  }
}
