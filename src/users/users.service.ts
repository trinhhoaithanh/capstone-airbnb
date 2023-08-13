import { responseArray, responseObject } from './../util/response-template';
import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class UsersService {
  prisma = new PrismaClient();
  constructor(private jwtService: JwtService) {}

  // Get users
  async getUsers() {
    try {
      let getUsers = await this.prisma.users.findMany();
      let data = getUsers.map((user) => ({ ...user, pass_word: '' }));
      
      return responseArray(200, "Get users successfully!", data.length, data); 
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Create a user
  async createUser(user) {
    try {
      let { email, pass_word, full_name, birth_day, gender, user_role, phone } = user;

      // check email if exists
      let checkEmail = await this.prisma.users.findFirst({
        where: {
          email,
        },
      });

      if (checkEmail) {
        throw new BadRequestException(responseObject(400, "Request is invalid", "Email already existed!"));  
      } else {
        let newUser = {
          email,
          pass_word: bcrypt.hashSync(pass_word, 10),
          full_name,
          birth_day,
          gender,
          user_role: Roles.USER,
          phone,
        };

        await this.prisma.users.create({
          data: newUser,
        });

        return {
          statusCode: 200,
          message: 'Create user successfully!',
          content: newUser,
          dateTime: new Date().toISOString(),
        };
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Delete user
  // Only user can delete himself or admin can delete anyone 
  async deleteUserById(delete_id: number, token: string) {
    try {
      const decodedToken = await this.jwtService.decode(token); 
      const userId = decodedToken["user_id"]; 
      const userRole = decodedToken["user_role"]; 

      // Check the existence of the user to delete 
      let checkUser = await this.prisma.users.findUnique({
        where: {
          user_id: delete_id
        }
      }); 
       
      if (checkUser) {
        if (userId === delete_id || userRole === Roles.ADMIN) {
          return {
            statusCode: 200,
            message: "Delete user successfully!",
            content: await this.prisma.users.delete({
              where: {
                user_id: delete_id
              }
            }),
            dateTime: new Date().toISOString()
          }
        } else {
          throw new ForbiddenException({
            statusCode: 403,
            message: "You don't have permission to access!",
            dateTime: new Date().toISOString()
          })
        }
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: "user not found",
          dateTime: new Date().toISOString()
        })
      }
    } catch (err) {
      throw new HttpException(err.response, err.status); 
    }
  }

  // Get users pagination
  async getUsersByPagination(pageIndex, pageSize, keyword) {
    try {
      let startIndex = (pageIndex - 1) * pageSize;
      let endIndex = startIndex + pageSize;

      let filteredItems = await this.prisma.users.findMany({
        where: {
          full_name: {
            contains: keyword,
          },
        },
      });

      if (keyword) {
        filteredItems = filteredItems.filter((item) =>
          item.full_name.toLowerCase().includes(keyword.toLowerCase()),
        );
      }

      let itemSlice = filteredItems.slice(startIndex, endIndex);

      return {
        statusCode: 200,
        message: 'Get rooms successfully',
        content: {
          pageIndex,
          pageSize,
          totalRow: filteredItems.length,
          keyword: `Name LIKE %${keyword}%`,
          data: itemSlice,
        },
        dateTime: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get user by user_id
  async getUserById(userId: number) {
    try {
      let checkUser = await this.prisma.users.findFirst({
        where: {
          user_id: userId,
        },
      });
      let data = { ...checkUser, pass_word: '' };

      if (checkUser) {
        return {
          statusCode: 200,
          message: 'Get user successfully!',
          content: data,
          dateTime: new Date().toISOString(),
        };
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Request is invalid',
          content: 'User not found!',
          dateTime: new Date().toISOString(),
        });
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get user by user_name
  async getUserByName(userName) {
    try {
      let checkName = await this.prisma.users.findMany({
        where: {
          full_name: {
            contains: userName,
          },
        },
      });

      // console.log("checkName", checkName)

      if (checkName.length > 0) {
        return {
          statusCode: 200,
          message: 'Get users successfully!',
          total: checkName.length,
          content: checkName,
          dateTime: new Date().toISOString()
        };
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Request is invalid',
          content: 'User not found!',
          dateTime: new Date().toISOString(),
        });
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Update user
  async updateUser(token, userUpdate) {
    try {
      const decodedToken = await this.jwtService.decode(token);
      const userId = decodedToken['user_id']; 
      const userRole = decodedToken['user_role']
      const { full_name, email, birth_day, gender, user_role, phone } =
        userUpdate;

      let newData = {
        full_name,
        email,
        birth_day,
        gender,
        user_role:userRole,
        phone,
      };

      await this.prisma.users.update({
        where: {
          user_id: userId,
        },
        data: newData,
      });

      return {
        statusCode: 200,
        message: 'Update user successfully!',
        content: newData,
        dateTime: new Date().toISOString(),
      };
    } catch (err) {
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
          user_id: userId,
        },
        data: {
          avatar: file.filename,
        },
      });

      return {
        statusCode: 200,
        message: 'Upload avatar successfully!',
        content: userInfo,
        dateTime: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
