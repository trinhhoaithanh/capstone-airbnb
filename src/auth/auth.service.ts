import { Injectable, HttpException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  prisma = new PrismaClient();

  // sign up
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
          content: newUser,
          dateTime: new Date().toISOString(),
        };
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // login
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

          let token = this.jwtService.signAsync(
            { user_id: Number(checkUser.user_id) },
            { secret: this.configService.get('KEY'), expiresIn: '60m' },
          );

          return token;
        } else {
          throw new HttpException('Password is incorrect!', 400);
        }
      } else {
        throw new HttpException('Email or password is incorrect!', 400);
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
