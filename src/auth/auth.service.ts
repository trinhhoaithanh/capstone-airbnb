import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { check } from 'prettier';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  prisma = new PrismaClient();

  // Sign up
  async signUp(userSignup) {
    try {
      let { email, pass_word, full_name, birth_day, gender, user_role, phone } =
        userSignup;

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
          message: 'Sign up successfully!',
          content: newUser,
          dateTime: new Date().toISOString(),
        };
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Login
  async login(userLogin) {
    try {
      const { email, pass_word } = userLogin;

      let checkUser = await this.prisma.users.findFirst({
        where: {
          email,
        },
      });

      if (checkUser) {
        if (bcrypt.compareSync(pass_word, checkUser.pass_word)) {
          checkUser = { ...checkUser, pass_word: '' };

          // generate token with user_id and user_role inside 
          let tokenGenerate = await this.jwtService.signAsync(
            { user_id: Number(checkUser.user_id), user_role: checkUser.user_role },
            { secret: this.configService.get('KEY'), expiresIn: '60m' },
          );

          return {
            statusCode: 200,
            message: 'Login successfully!',
            content: {
              userLogin: checkUser,
              token: tokenGenerate,
            },
            dateTime: new Date().toISOString(),
          };
        } else {
          // throw new HttpException('Password is incorrect!', 400);
          throw new BadRequestException({
            statusCode: 400,
            message: 'Request is invalid',
            content: 'Password is incorrect!',
            dateTime: new Date().toISOString(),
          });
        }
      } else {
        // throw new HttpException('Email or password is incorrect!', 400);
        throw new BadRequestException({
          statusCode: 400,
          message: 'Request is invalid',
          content: 'Email or password is incorrect!',
          dateTime: new Date().toISOString(),
        });
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
