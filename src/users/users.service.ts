import { responseArray, responseObject } from './../util/response-template';
import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { check } from 'prettier';
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
      let { email, pass_word, full_name, birth_day, gender, phone } = user;

      // check email if exists
      let checkEmail = await this.prisma.users.findFirst({
        where: {
          email
        }
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

        return responseObject(200, "Create user successfully!", newUser); 
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Delete user
  // Only user can delete himself or admin can delete anyone 
  async deleteUserById(delete_id, token) {
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
          // Delete user_id if exists in reservations model as foreign key
          await this.prisma.reservations.deleteMany({
            where: {
              user_id: delete_id
            }
          }); 

          // Delete user_id if exists in reviews model as foreign key
          await this.prisma.reviews.deleteMany({
            where: {
              user_id: delete_id
            }
          }); 

          // Delete user_id in users model as primary key
          let deletedUser = await this.prisma.users.delete({
            where: {
              user_id: delete_id
            }
          }); 
          
          return responseObject(200, "Delete user successfully!", deletedUser); 
        } else {
          throw new ForbiddenException(responseObject(403, "Request is invalid", "You don't have permission to access!")); 
        }
      } else {
        throw new NotFoundException(responseObject(404, "Request is invalid", "User not found!")); 
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

      if (filteredItems.length > 0) {
        return responseObject(200, "Get rooms successfully!", {
          pageIndex,
          pageSize,
          totalRow: filteredItems.length,
          keyword: `Name LIKE %${keyword}%`,
          data: itemSlice
        });
      } else {
        return responseObject(200, "No matching results found!", {
          pageIndex,
          pageSize,
          totalRow: filteredItems.length,
          keyword: `Name LIKE %${keyword}%`,
          data: itemSlice
        })
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get user by user_id
  async getUserById(userId) {
    try {
      let checkUser = await this.prisma.users.findUnique({
        where: {
          user_id: userId,
        },
      });
      let data = { ...checkUser, pass_word: '' };

      if (checkUser) {
        return responseObject(200, "Get user successfully!", data); 
      } else {
        throw new NotFoundException(responseObject(404, "Request is invalid", "User not found!")); 
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

      if (checkName.length > 0) {
        return responseArray(200, "Get users successfully!", checkName.length, checkName); 
      } else {
        throw new NotFoundException(responseObject(404, "Request is invalid", "User not found!")); 
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
      const userRole = decodedToken['user_role'];

      const { full_name, email, birth_day, gender, phone } = userUpdate;

      let newData = {
        full_name,
        email,
        birth_day,
        gender,
        user_role: userRole,
        phone,
      };

      await this.prisma.users.update({
        where: {
          user_id: userId,
        },
        data: newData,
      });

      return responseObject(200, "Update user successfully!", newData); 
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
      
      return responseObject(200, "Upload avatar successfully!", userInfo); 
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
