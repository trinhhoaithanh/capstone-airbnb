import { responseArray, responseObject } from './../util/response-template';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ReservationsService {
  prisma = new PrismaClient();
  constructor(private jwtService: JwtService) { }

  // Get reservations
  async getReservation() {
    try {
      const reservations = await this.prisma.reservations.findMany(); 
      return responseArray(200, 'Get all reservations successfully!', reservations.length, reservations); 
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Create reservation
  async createReservation(token, reservation) {
    try {
      const userId = await this.jwtService.decode(token)['user_id'];

      let { room_id, guest_amount } = reservation;

      let newReservation = {
        room_id,
        start_date: new Date(),
        end_date: new Date(),
        guest_amount,
        user_id: userId
      };

      let checkUser = await this.prisma.users.findUnique({
        where: {
          user_id: userId
        }
      });

      if (checkUser) {
        let findRoom = await this.prisma.rooms.findUnique({
          where: {
            room_id
          }
        });

        if (findRoom) {
          let bookRoom = await this.prisma.reservations.create({
            data: newReservation
          });
          return responseObject(201, "Book room successfully!", bookRoom);
        } else {
          throw new NotFoundException(responseObject(404, "Request is invalid", "Room not found!"));
        }
      } else {
        throw new NotFoundException(responseObject(404, "Request is invalid", "User not found!"));
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get reservation by reservation_id
  async getReservationById(reservationId) {
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
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Request is invalid',
          content: 'Reservation is not found',
          dateTime: new Date().toISOString(),
        });
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get reservation by user_id
  async getReservationByUserId(userId) {
    try {


      let checkUser = await this.prisma.users.findFirst({
        where: {
          user_id: userId
        }
      })

      if (checkUser) {
        let checkReservation = await this.prisma.reservations.findMany({
          where: {
            user_id: userId,
          },
        });

        if (checkReservation.length > 0) {
          return {
            statusCode: 200,
            message: 'Get reservations successfully!',
            content: checkReservation,
            dateTime: new Date().toISOString(),
          };
        } else {
          throw new NotFoundException({
            statusCode: 400,
            message: 'Request is invalid',
            content: 'This user has not reserved any room yet',
            dateTime: new Date().toISOString(),
          });
        }
      }
      else {
        throw new NotFoundException(responseObject(404, "Request is invalid", "User not found"))
      }


    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Update reservation
  async updateReservation(reservationId, token, reservationUpdate) {
    // try {
    const decodedToken = await this.jwtService.decode(token);
    const userId = decodedToken['user_id'];

    const { room_id, start_date, end_date, guest_amount } = reservationUpdate;

    let newData = {
      room_id,
      start_date,
      end_date,
      guest_amount,
    };

    let checkReservation = await this.prisma.reservations.findFirst({
      where: {
        reservation_id: Number(reservationId),
      },
    });

    // Check if reservation_id exists in reservations table
    if (checkReservation) {
      let checkUser = await this.prisma.reservations.findFirst({
        where: {
          user_id: userId,
        },
      });

      // Check if user_id matches that reservation_id
      if (checkUser) {
        let checkRoom = await this.prisma.rooms.findFirst({
          where: {
            room_id
          }
        })
        if (checkRoom) {
          return {
            statusCode: 200,
            message: 'Update reservation successfully!',
            content: await this.prisma.reservations.update({
              where: {
                reservation_id: Number(reservationId),
              },
              data: newData,
            }),
            dateTime: new Date().toISOString(),
          };
        }
        else {
          throw new NotFoundException(responseObject(404, "Request is invalid", "Room not found"))
        }

      } else {
        throw new ForbiddenException({
          statusCode: 403,
          message: 'Request is invalid',
          content: 'You are not allowed to update this',
          dateTime: new Date().toISOString(),
        });
      }
    } else {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Request is invalid',
        content: 'Reservation not found',
        dateTime: new Date().toISOString(),
      });
    }
    // } catch (err) {
    //   throw new HttpException(err.response, err.status);
    // }
  }

  // Delete reservation by reservation id
  async deleteReservationByReservationId(reservationId) {
    let checkReservation = await this.prisma.reservations.findFirst({
      where: {
        reservation_id: reservationId,
      },
    });

    if (checkReservation) {
      await this.prisma.reservations.delete({
        where: {
          reservation_id: reservationId,
        },
      });
      return {
        statusCode: 200,
        message: 'Delete reservation successfully!',
        content: null,
        dateTime: new Date().toISOString(),
      };
    } else {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Request is invalid',
        content: 'Reservation not found',
        dateTime: new Date().toISOString(),
      });
    }
  }
}
