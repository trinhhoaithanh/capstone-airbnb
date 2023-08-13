import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {

    @ApiProperty()
    review_date:Date

    @ApiProperty()
    content:string

    @ApiProperty()
    rating:number
}
