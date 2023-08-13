import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Put,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { Review } from './entities/review.entity';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Get reviews
  @Get('get-reviews')
  getReviews() {
    return this.reviewsService.getReviews();
  }

  // Update review
  @ApiHeader({
    name: 'token',
    description: 'Your authentication token',
    required: true,
  })
  @Put('update-review/:review_id')
  updateReview(
    @Headers('token') token,
    @Param('review_id') review_id: number,
    @Body() reviewUpdate:UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(
      token,
      Number(review_id),
      reviewUpdate,
    );
  }

  // Create review
  @ApiHeader({
    name: 'token',
    description: 'Your authentication token',
    required: true,
  })
  @Post('create-review')
  createReview(@Headers('token') token, @Body() newReview: Review) {
    return this.reviewsService.createReview(token, newReview);
  }

  // Get reviews by room_id
  @ApiParam({
    name: "room_id",
    required: true
  })
  @Get('get-review-by-room/:room_id')
  getReviewByRoom(@Param('room_id') roomId: Number) {
    return this.reviewsService.getReviewByRoom(+roomId);
  }
}
