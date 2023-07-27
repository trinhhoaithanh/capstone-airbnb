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
  async getUsers(tokenUser) {
    try {
      let decodedToken = await this.jwtService.decode(tokenUser)
      let id = decodedToken['user_id']
      
      let checkUser = await this.prisma.users.findMany();

      if (checkUser) {
        return {
          statusCode: 200,
          content: [checkUser],
          dateTime: new Date().toISOString()
        }
      } else {
        throw new HttpException('user not found!', 400);
      }

    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
