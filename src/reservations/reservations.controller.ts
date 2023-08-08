import { Body, Controller, Get, Header, Headers, Param, Post} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Reservation } from './entities/reservation.entity';



@ApiTags("Reservations")
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // Get reservations 
  @Get("get-reservations")
  getReservation() {
    return this.reservationsService.getReservation(); 
  }

  @ApiHeader({
    name: "token",
    description: "Your authentication token",
    required: true
  })
  // Create reservation
  @Post("create-reservation")
  @ApiBody({type:Reservation})
  createReservation(@Headers() token:string, @Body() reservation: Reservation){
    return this.reservationsService.createReservation(reservation,token)
  } 

  // get reservation by id 
  @Get("get-reservation-by-id/:reservation_id")
  getReservationById(@Param() reservation_id:number){
    return this.reservationsService.getReservationById(reservation_id)
  }

  // get reservation by user id
  @ApiHeader({
    name: "token",
    description: "Your authentication token",
    required: true
  })
  @Get("get-reservation-by-user-id/:user_id")
  getReservationByUserId(@Headers() token:string){
    return this.reservationsService.getReservationById(token)
  }

}
