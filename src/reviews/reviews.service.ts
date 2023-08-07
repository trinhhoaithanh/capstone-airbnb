import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {

    constructor(private jwtService:JwtService) {}

    prisma = new PrismaClient()

    // Get comments
    async getComment(){
        try{
            let checkReview = await this.prisma.reviews.findMany()

            if(checkReview.length >0){
                return {
                    statusCode:200,
                    content:checkReview,
                    dateTime: new Date().toISOString()
                }
            }
            else{
                throw new NotFoundException({
                    statusCode: 404,
                    message: "Request is invalid",
                    content: "There's no comment",
                    dateTime: new Date().toISOString()
                  }); 
            }


      
        }
        catch(err){
            throw new HttpException(err.response, err.status); 
        }
    }

    // Update comment
    async updateComment(token, review_id, commentUpdate){
        try {
            const decodedToken = await this.jwtService.decode(token)
            const userId = decodedToken['user_id']

            let {review_id, room_id, user_id, review_date, content, rating} = commentUpdate

            await this.prisma.reviews.update({
                where:{
                    review_id:review_id,
                    user_id:userId
                },
                data:commentUpdate
            })
            return {
                statusCode:200,
                message: "Update review successfully",
                content:commentUpdate,
                dateTime:new Date().toISOString()
            }
        } catch (err) {
            throw new HttpException(err.response, err.status); 
        }
    }
  
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
  async getReviewByRoom(roomId: number) {
    try {
      let checkRoom = await this.prisma.rooms.findFirst({
        where: {
          room_id: roomId
        }
      });

      if (checkRoom) {
        let checkRoomInReview = await this.prisma.reviews.findFirst({
          where: {
            room_id: roomId
          }
        });

        if (checkRoomInReview) {
          let data = await this.prisma.reviews.findMany({
            where: {
              room_id: roomId
            },
            include: {
              users: true,
              rooms: true
            }
          }); 
          // console.log("data", data)
          
          const [{review_id, users, content, review_date, rooms}] = data; 
          const newData = {
            review_id,
            room_name: rooms.room_name,
            user_name: users.full_name,
            content,
            review_date
          }

          return {
            statusCode: 200,
            message: "Get reviews by room_id successfully!",
            content: newData,
            dateTime: new Date().toISOString()
          }
        } else {
          // When room doesn't have any reviews yet 
          return ({
            statusCode: 200,
            message: "This room doesn't have any reviews yet!",
            content: null,
            dateTime: new Date().toISOString()
          })
        }
      } else {
        // When room doesn't exist 
        throw new NotFoundException ({
          statusCode: 404,
          message: "Request is invalid",
          content: "Room not found",
          dateTime: new Date().toISOString()
        })
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}