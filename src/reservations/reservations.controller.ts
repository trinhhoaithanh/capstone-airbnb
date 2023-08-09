import { Body, Controller, Get, Headers, Param, Post, Put, Query} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBody, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
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

  // Create reservation
  @ApiHeader({
    name: "token",
    description: "Your authentication token",
    required: true
  })
  @Post("create-reservation")
  createReservation(@Headers("token") token, @Body() reservation: Reservation){
    return this.reservationsService.createReservation(reservation,token)
  } 

  // Get reservation by reservation_id
  @ApiParam({ name: 'reservation_id'})
  @Get("get-reservation-by-id/:reservation_id")
  getReservationById(@Param("reservation_id") reservationId:number){
    return this.reservationsService.getReservationById(Number(reservationId))
  }

  // Get reservation by user_id
  @ApiHeader({
    name: "token",
    description: "Your authentication token",
    required: true
  })
  @Get("get-reservation-by-user-id/:user_id")
  getReservationByUserId(@Headers("token") token){
    return this.reservationsService.getReservationByUserId(token)
  }

  // Update reservation
  @ApiParam({
    name: "reservation_id",
    required: true
  })
  @ApiHeader({
    name: "token",
    description: "Your authentication token",
    required: true
  })
  @Put("update-reservation/:reservation_id")
  updateReservation(
    @Param("reservation_id") reservationId: number,
    @Headers("token") token,
    @Body() reservationUpdate: UpdateReservationDto
  ) {
    return this.reservationsService.updateReservation(+reservationId, token, reservationUpdate);
  }


}
