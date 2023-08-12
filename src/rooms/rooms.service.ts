import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

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
  async createRoom(token, room) {
    try {
      const {
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
      } = room;

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

      let checkLocation = await this.prisma.location.findFirst({
        where: {
          location_id,
        },
      });

      if (checkLocation) {
        await this.prisma.rooms.create({
          data: newRoom,
        });

        return {
          statusCode: 201,
          message: 'Create room successfully',
          content: newRoom,
          dateTime: new Date().toISOString(),
        };
      } else {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Request is invalid',
          content: 'Location not found',
          dateTime: new Date().toISOString(),
        });
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
