import { Injectable,HttpException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
@Injectable()
export class AuthService {
  

  prisma = new PrismaClient();

  // sign up 
  async signUp(userSignup) {
    try {
      let { email, pass_word, name, birth_day, gender, role, phone } = userSignup;

      // check email if exists
      let checkEmail = await this.prisma.users.findFirst({
        where: {
          email
        }
      })

      if (checkEmail) {
        throw new HttpException('Email is already existed', 400);
      } else {
        let newUser = {
          email,
          pass_word: bcrypt.hashSync(pass_word, 10),
          name,
          birth_day,
          gender,
          role,
          phone,
        }
        console.log(newUser); 

        await this.prisma.users.create({
          data: newUser
        })

        return "Sign up successfully"
      }
    }
    catch (err) {
      throw new HttpException(err.response, err.status);
    }

  }

  // login
  async login(userLogin){
    
  }



}
