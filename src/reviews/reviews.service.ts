import { JwtService } from '@nestjs/jwt';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Review } from './entities/review.entity';
import { check } from 'prettier';

@Injectable()
export class ReviewsService {

  prisma = new PrismaClient();
  constructor(private jwtService: JwtService) {}
  
  // Create review
  async createReview(token: string, newReview: Review) {
    try {
      const decodedToken = await this.jwtService.decode(token);
      const userId = decodedToken["user_id"]; 

      const {room_id, content, rating} = newReview; 

      const newData = {
        room_id,
        user_id: +userId,
        review_date: new Date(),
        content,
        rating
      }; 

      let checkRoom = await this.prisma.rooms.findFirst({
        where: {
          room_id
        }
      }); 

      if (checkRoom) {
        await this.prisma.reviews.create({
          data: newData
        });

        return {
          statusCode: 201,
          message: "Create review successfully",
          content: newData,
          dateTime: new Date().toISOString()
        }
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: "Request is invalid",
          content: "Room not found!",
          dateTime: new Date().toISOString()
        })
      }
    
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get reviews by room_id
  async getReviewByRoom() {
    
  }
}
