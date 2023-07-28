import { check } from 'prettier';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
      let data = getUsers.map(user => ({...user, pass_word: ""}));
      
      return {
        statusCode: 200,
        content: data,
        dateTime: new Date().toISOString()
      } 

    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Delete user
  async deleteUserById(userId: number) {
    try {
      let checkUser = await this.prisma.users.findFirst({
        where: {
          user_id: userId
        }
      });

      if (checkUser) {
        await this.prisma.users.delete({
          where: {
            user_id: userId
          }
        })
        return {
          statusCode: 200,
          message: "Delete user successfully!",
          content: null,
          dateTime: new Date().toISOString()
        }
      }
      else {
        return {
          statusCode: 404,
          message: "User not found",
          content: null,
          dateTime: new Date().toISOString()
        }
      }
    } catch (err) {
      throw new HttpException(err.response, err.status)
    }
  }

  // Get user by user_id
  async getUserById(userId: number) {
    try {
      let checkUser = await this.prisma.users.findFirst({
        where: {
          user_id: userId
        }
      });
      let data = {...checkUser, pass_word: ""};
      
      if (checkUser) {
          return {
            statusCode: 200,
            content: data,
            dateTime: new Date().toISOString()
          }
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: "Request is invalid",
          content: "User not found!",
          dateTime: new Date().toISOString()
        }); 
      }
    } catch (err) {
      throw new HttpException(err.response, err.status); 
    }
  }
}
   

