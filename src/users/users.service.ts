import { check } from 'prettier';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'

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

  // Create a user
  async createUser(user) {
    try {
      let { email, pass_word, full_name, birth_day, gender, user_role, phone } =
      user;

      // check email if exists
      let checkEmail = await this.prisma.users.findFirst({
        where: {
          email,
        },
      });

      if (checkEmail) {
        throw new HttpException('Email is already existed', 400);
      } else {
        let newUser = {
          email,
          pass_word: bcrypt.hashSync(pass_word, 10),
          full_name,
          birth_day,
          gender,
          user_role,
          phone,
        };

        await this.prisma.users.create({
          data: newUser,
        });

        return {
          statusCode: 200,
          content: newUser,
          dateTime: new Date().toISOString(),
        };
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

  // Get user by user_name
  async getUserByName(userName: string) {
    try {
      let checkName = await this.prisma.users.findMany({
        where: {
          full_name: {
            contains: userName
          }
        }
      }); 

      if (checkName.length > 0) {
        return {
          statusCode: 200,
          content: checkName,
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

  // Update user
  async updateUser(token, userUpdate){
    try{
      const decodedToken = await this.jwtService.decode(token)
      const userId = decodedToken['user_id']

      const {full_name, email, birth_day, gender, user_role, phone} = userUpdate;

      let newData = {
        full_name,
        email, 
        birth_day, 
        gender, 
        user_role, 
        phone
      }

      await this.prisma.users.update({
        where:{
          user_id:userId
        },
        data:newData
      })

      return {
        statusCode: 200,
        content: newData,
        dateTime: new Date().toISOString()
      }
    }
    catch(err){
      throw new HttpException(err.response, err.status);
    }
  }

  // Upload avatar
  async uploadAvatar(token, file: Express.Multer.File) {
    try {
      const decodedToken = await this.jwtService.decode(token);
      const userId = decodedToken['user_id'];

      let userInfo = await this.prisma.users.update({
        where: {
          user_id: userId
        },
        data: {
          avatar: file.filename
        }
      })

      return {
        statusCode: 200,
        content: userInfo,
        dateTime: new Date().toISOString()
      }     
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
   

