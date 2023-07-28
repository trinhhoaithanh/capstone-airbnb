import { check } from 'prettier';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class UsersService {
  
  prisma = new PrismaClient(); 
  constructor(private jwtService: JwtService) {}

  // Get users 
  async getUsers() {
    try {
      let getUsers = await this.prisma.users.findMany();
      let data = getUsers.map(user => ({...user, pass_word: ""}))
      
      return {
        statusCode: 200,
        content: data,
        dateTime: new Date().toISOString()
      } 

    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
