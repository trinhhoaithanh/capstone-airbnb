import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class RoomsService {
  prisma = new PrismaClient();
  constructor(private jwtService: JwtService) {}

  // Get rooms
  async getRooms() {
    try {
      return {
        statusCode: 200,
        message: 'Get all rooms successfully!',
        content: await this.prisma.rooms.findMany(),
        dateTime: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Create room
  // Only admin can create new room
  async createRoom(token, room) {
    try {
      const decodedToken = await this.jwtService.decode(token);
      const userId = decodedToken['user_id'];
      const userRole = decodedToken['user_role'];

      const { room_name, client_number, bed_room, bed, bath_room, description, price, washing_machine, iron, tivi, air_conditioner, wifi, kitchen, parking, pool, location_id, image } = room;

      let newRoom = {
        room_name,
        client_number,
        bed_room,
        bed,
        bath_room,
        description,
        price,
        washing_machine,
        iron,
        tivi,
        air_conditioner,
        wifi,
        kitchen,
        parking,
        pool,
        location_id,
        image,
      };

      // Check if user_id from token exists
      let checkUser = await this.prisma.users.findUnique({
        where: {
          user_id: userId
        }
      });

      if (checkUser) {
        // Check if user_role is admin 
        if (userRole === Roles.ADMIN) {
          // Check if location_id exists before creating new room
          let checkLocation = await this.prisma.location.findUnique({
            where: {
              location_id
            }
          });

          if (checkLocation) {
            return {
              statusCode: 201,
              message: "Create room successfully!",
              content: await this.prisma.rooms.create({
                data: newRoom
              }),
              dateTime: new Date().toISOString()
            }
          } else {
            throw new NotFoundException({
              statusCode: 404,
              message: "Request is invalid",
              content: "Location not found!",
              dateTime: new Date().toISOString()
            })
          }
        } else {
          throw new ForbiddenException({
            statusCode: 403,
            message: "You don't have permission to access!",
            dateTime: new Date().toISOString()
          })
        }
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: "Request is invalid",
          content: "User not found!",
          dateTime: new Date().toISOString()
        })
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get rooms by pagination
  async getRoomsByPagination(pageIndex, pageSize, keyword) {
    try {
      const startIndex = (pageIndex - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      let filteredItems = await this.prisma.rooms.findMany({
        where: {
          room_name: {
            contains: keyword,
          },
        },
      });

      if (keyword) {
        filteredItems = filteredItems.filter((item) =>
          item.room_name.toLowerCase().includes(keyword.toLowerCase()),
        );
      }

      const itemSlice = filteredItems.slice(startIndex, endIndex);
      return {
        statusCode: 200,
        message: 'Get rooms successfully',
        content: {
          pageIndex,
          pageSize,
          totalRow: filteredItems.length,
          keyword: `Room name LIKE %${keyword}%`,
          data: itemSlice,
        },
        dateTime: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get room by room_id
  async getRoomById(roomId) {
    try {
      let checkRoom = await this.prisma.rooms.findFirst({
        where: {
          room_id: roomId,
        },
      });

      if (checkRoom) {
        return {
          statusCode: 200,
          message: 'Get room successfully!',
          content: checkRoom,
          dateTime: new Date().toISOString(),
        };
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Request is invalid',
          content: 'Room not found',
          dateTime: new Date().toISOString(),
        });
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // get room by location id
  async getRoomByLocationId(locationId: number) {
    try {
      let checkRoomByLocation = await this.prisma.rooms.findMany({
        where: {
          location_id: locationId,
        },
      });

      if (checkRoomByLocation.length > 0) {
        return {
          statusCode: 200,
          message: 'Get room by location id successfully!',
          content: checkRoomByLocation,
          dateTime: new Date().toISOString(),
        };
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Request is invalid',
          content: 'Invalid location',
          dateTime: new Date().toISOString(),
        });
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
