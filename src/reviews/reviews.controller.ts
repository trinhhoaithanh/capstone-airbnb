import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

      // Get reviews 
      @Get("get-comments")
      getComment(){
        return this.reviewsService.getComment()
      }

      // Update review
      @ApiHeader({
        name: 'token',
        description: 'Your authentication token', 
        required: true, 
      })
      @Put("update-comment/:comment_id")
      updateComment(@Headers("token") token, @Param("review_id") review_id:number, @Body() commentUpdate){
        return this.reviewsService.updateComment(token, Number(review_id),commentUpdate)
      }
}
