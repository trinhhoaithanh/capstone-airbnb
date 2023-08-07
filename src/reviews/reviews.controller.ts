import { Body, Controller, Get, Headers, Post, Query, } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Review } from './entities/review.entity';

@ApiTags("Reviews")
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

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
