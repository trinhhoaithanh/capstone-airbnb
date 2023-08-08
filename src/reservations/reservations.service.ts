import { PrismaClient } from '@prisma/client';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ReservationsService {
  constructor(private jwtService: JwtService) {}

  prisma = new PrismaClient();

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

  // create reservations
  async createReservation(reservation, token) {
    // try {
      let decodedToken = await this.jwtService.decode(token);
      let userId = decodedToken['user_id'];

      console.log(userId)

      let { room_id, start_date, end_date, guest_amount, user_id } = reservation;

      let findRoom = await this.prisma.rooms.findFirst({
        where:{
            room_id
        }
      })

      if(findRoom){
        let findReservation = await this.prisma.reservations.findFirst({
            where:{
                room_id
            }
          })
    
          if(findReservation){
            throw new NotFoundException({
                statusCode: 400,
                message: "Request is invalid",
                content: "This room is already booked",
                dateTime: new Date().toISOString()
              }); 
          }
          else{
            let newData = {
                room_id,
                start_date,
                end_date,
                guest_amount,
                user_id,
              };
    
              console.log(newData);
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
            content: "There's no room with that id",
            dateTime: new Date().toISOString()
          }); 
      }
 
    // } catch (err) {
    //   throw new HttpException(err.response, err.status);
    // }
  }

  //   get reservation by id
  async getReservationById(reservation_id) {
    try {
      let checkReservation = await this.prisma.reservations.findFirst({
        where: {
          reservation_id,
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
            content: "Reservation is not found",
            dateTime: new Date().toISOString()
          }); 
      }
    } catch (err) {
        throw new HttpException(err.response, err.status);
    }
  }

//   get reservation by user id
async getReservationByUserId(token){
    // try {
        let decodedToken = await this.jwtService.decode(token);
        let userId = decodedToken['user_id'];
        console.log(userId)

        let checkReservation = await this.prisma.reservations.findMany({
            where:{
                user_id:userId
            }
        })
        console.log(checkReservation)

        if(checkReservation.length>0){
            return {
                statusCode: 200,
                message: 'Get reservations successfully!',
                content: checkReservation,
                dateTime: new Date().toISOString(),
            }
        }
        else{
            throw new NotFoundException({
                statusCode: 400,
                message: "Request is invalid",
                content: "This user has not reserved any room yet",
                dateTime: new Date().toISOString()
              }); 
        }
    // } catch (err) {
    //     throw new HttpException(err.response, err.status);
    // }
}
}
