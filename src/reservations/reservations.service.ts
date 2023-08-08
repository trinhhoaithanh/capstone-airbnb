import { PrismaClient } from '@prisma/client';
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ReservationsService {
  

  prisma = new PrismaClient();
  constructor(private jwtService: JwtService) {}

  // Get reservations
  async getReservation() {
    try {
      return {
        statusCode: 200,
        message: 'Get all reservations successfully!',
        content: await this.prisma.reservations.findMany(),
        dateTime: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Create reservation
  async createReservation(reservation, token) {
    try {
      let decodedToken = await this.jwtService.decode(token);
      let userId = decodedToken['user_id'];

      // console.log("userId", userId); 

      let { room_id, start_date, end_date, guest_amount } = reservation;

      let findRoom = await this.prisma.rooms.findFirst({
        where:{
            room_id
        }
      })

      if (findRoom) {
        let findReservation = await this.prisma.reservations.findFirst({
          where: {
            room_id
          }
        })

        if (findReservation) {
          throw new BadRequestException({
            statusCode: 400,
            message: "Request is invalid",
            content: "This room is already booked",
            dateTime: new Date().toISOString()
          });
        }
        else {
          let newData = {
            room_id,
            start_date: new Date(),
            end_date: new Date(),
            guest_amount,
            user_id: userId
          };

          await this.prisma.reservations.create({
            data: newData,
          });

          return {
            statusCode: 201,
            message: 'Create reservation successfully',
            content: newData,
            dateTime: new Date().toISOString(),
          };
        }
      }
      else{
        throw new NotFoundException({
            statusCode: 404,
            message: "Request is invalid",
            content: "Room not found",
            dateTime: new Date().toISOString()
          }); 
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get reservation by reservation_id
  async getReservationById(reservationId: number) {
    try {
      let checkReservation = await this.prisma.reservations.findFirst({
        where: {
          reservation_id: reservationId,
        },
      });

      if (checkReservation) {
        return {
          statusCode: 200,
          message: 'Get reservation successfully!',
          content: checkReservation,
          dateTime: new Date().toISOString(),
        };
      }
      else{
        throw new NotFoundException({
            statusCode: 404,
            message: "Request is invalid",
            content: "Reservation not found",
            dateTime: new Date().toISOString()
          }); 
      }
    } catch (err) {
        throw new HttpException(err.response, err.status);
    }
  }

  // Get reservation by user id
  // async getReservationByUserId(token) {
  //   // try {
  //   let decodedToken = await this.jwtService.decode(token);
  //   let userId = decodedToken['user_id'];
  //   console.log(userId)

  //   let checkReservation = await this.prisma.reservations.findMany({
  //     where: {
  //       user_id: userId
  //     }
  //   })
  //   console.log(checkReservation)

  //   if (checkReservation.length > 0) {
  //     return {
  //       statusCode: 200,
  //       message: 'Get reservations successfully!',
  //       content: checkReservation,
  //       dateTime: new Date().toISOString(),
  //     }
  //   }
  //   else {
  //     throw new NotFoundException({
  //       statusCode: 400,
  //       message: "Request is invalid",
  //       content: "This user has not reserved any room yet",
  //       dateTime: new Date().toISOString()
  //     });
  //   }
  //   // } catch (err) {
  //   //     throw new HttpException(err.response, err.status);
  //   // }
  // }
}
