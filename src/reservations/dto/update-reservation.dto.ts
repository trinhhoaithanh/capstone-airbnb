import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
    @ApiProperty()
    room_id: number;

    @ApiProperty()
    start_date: Date

    @ApiProperty()
    end_date: Date

    @ApiProperty()
    guest_amount: number

    // @ApiProperty()
    // user_id: Number
}
