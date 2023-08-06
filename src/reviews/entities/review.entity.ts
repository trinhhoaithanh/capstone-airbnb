import { ApiProperty } from "@nestjs/swagger";

export class Review {
    @ApiProperty()
    room_id: number;

    // @ApiProperty()
    // user_id: number;

    @ApiProperty()
    review_date: Date;

    @ApiProperty()
    content: string;

    @ApiProperty()
    rating: number
}
