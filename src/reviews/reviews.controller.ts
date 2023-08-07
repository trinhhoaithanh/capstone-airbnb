import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Put,Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Review } from './entities/review.entity';

@ApiTags("Reviews")
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
  // Create review
  @ApiHeader({
    name: "token",
    description: "Your authentication token",
    required: true
  })
  @Post("create-review")
  createReview(
    @Headers("token") token,
    @Body() newReview: Review) {
    return this.reviewsService.createReview(token, newReview); 
  }

  // Get reviews by room_id 
  @Get("get-review-by-room/:room_id")
  getReviewByRoom(@Query("room_id") roomId: Number ) {
    return this.reviewsService.getReviewByRoom(+roomId); 
  }
}
