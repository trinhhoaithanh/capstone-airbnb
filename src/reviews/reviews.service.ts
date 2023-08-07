import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

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
}
