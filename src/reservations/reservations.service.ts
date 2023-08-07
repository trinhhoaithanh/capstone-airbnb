import { PrismaClient } from '@prisma/client';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {

    prisma = new PrismaClient();
  
    // Get reservations
    async getReservation() {
        try {
            return {
                statusCode: 200,
                message: "Get all reservations successfully!",
                content: await this.prisma.reservations.findMany(),
                dateTime: new Date().toISOString()
            }
        } catch (err) {
            throw new HttpException(err.response, err.status); 
        }
    }
}
