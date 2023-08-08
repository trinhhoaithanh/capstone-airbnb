import { ApiProperty } from "@nestjs/swagger";

export class Reservation {
    

    @ApiProperty()
    room_id: number;

    @ApiProperty()
    start_date: Date

    @ApiProperty()
    end_date:Date

    @ApiProperty()
    guest_amount:number
    
    
}
