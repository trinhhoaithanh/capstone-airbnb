import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { Review } from './entities/review.entity';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class ReviewsService {
  constructor(private jwtService: JwtService) {}

  prisma = new PrismaClient();

  // Get reviews
  async getReviews() {
    try {
      let checkReview = await this.prisma.reviews.findMany();

      if (checkReview.length > 0) {
        return {
          statusCode: 200,
          content: checkReview,
          dateTime: new Date().toISOString(),
        };
      } else {
        return{
          statusCode: 200,
          message: "There's no review",
          content:checkReview ,
          dateTime: new Date().toISOString(),
        };
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Update review (only user can update his/her own review or admin can update)
  async updateReview(token, review_id, reviewUpdate) {
    try {
      const decodedToken = await this.jwtService.decode(token);
      const userId = decodedToken['user_id'];
      const userRole = decodedToken['user_role']

      let checkReview = await this.prisma.reviews.findUnique({
        where:{
          review_id
        }
      })

      if(checkReview){
        if(checkReview.user_id===userId || userRole === Roles.ADMIN){
          let {  user_id, review_date, content, rating } =
          reviewUpdate;
  
        let newReview = {
      
          user_id:userId, 
          review_date: new Date(), 
          content, 
          rating
        }
  
        await this.prisma.reviews.update({
          where: {
            review_id: review_id,
          },
          data: newReview,
        });
        return {
          statusCode: 200,
          message: 'Update review successfully',
          content: newReview,
          dateTime: new Date().toISOString(),
        };
        }
        else{
          throw new ForbiddenException({
            statusCode:403,
            message: "You don't have permission to access!",
            dateTime: new Date().toISOString(),
          })
        }
        
      }
      else{
        throw new NotFoundException({
          statusCode:404,
          message: 'Request is invalid',
          content: 'Review not found!',
          dateTime: new Date().toISOString(),
        })
      }
      
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Create review
  async createReview(token: string, newReview: Review) {
    try {
      const decodedToken = await this.jwtService.decode(token);
      const userId = decodedToken['user_id'];

      const { room_id, content, rating } = newReview;

      const newData = {
        room_id,
        user_id: +userId,
        review_date: new Date(),
        content,
        rating,
      };

      let checkRoom = await this.prisma.rooms.findFirst({
        where: {
          room_id,
        },
      });

      if (checkRoom) {
        await this.prisma.reviews.create({
          data: newData,
        });

        return {
          statusCode: 201,
          message: 'Create review successfully',
          content: newData,
          dateTime: new Date().toISOString(),
        };
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Request is invalid',
          content: 'Room not found!',
          dateTime: new Date().toISOString(),
        });
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get reviews by room_id
  async getReviewByRoom(roomId: number) {
    try {
      let checkRoom = await this.prisma.rooms.findFirst({
        where: {
          room_id: roomId,
        },
      });

      if (checkRoom) {
        let checkRoomInReview = await this.prisma.reviews.findMany({
          where: {
            room_id: roomId
          },
        });

        if (checkRoomInReview) {
          let data = await this.prisma.reviews.findMany({
            where: {
              room_id: roomId,
            },
            include: {
              users: true,
              rooms: true,
            },
          });

          let newData = data.map((review) => {
            return {
              review_id: review.review_id,
              user_name: review.users.full_name,
              room_name: review.rooms.room_name,
              content: review.content,
              date: review.review_date,
              rating: review.rating
            }
          })
         
          return {
            statusCode: 200,
            message: 'Get reviews successfully!',
            total: data.length,
            content: newData,
            dateTime: new Date().toISOString(),
          };
        } else {
          // When room doesn't have any reviews yet
          return {
            statusCode: 200,
            message: "This room doesn't have any reviews yet!",
            content: null,
            dateTime: new Date().toISOString(),
          };
        }
      } else {
        // When room doesn't exist
        throw new NotFoundException({
          statusCode: 404,
          message: 'Request is invalid',
          content: 'Room not found',
          dateTime: new Date().toISOString(),
        });
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
