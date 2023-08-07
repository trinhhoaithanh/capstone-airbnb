import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { User } from 'src/users/entities/user.entity';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RoomsService {
  
    prisma = new PrismaClient();
    constructor(private jwtService: JwtService) {} 

    // Create room
    async createRoom(token, room) {
        try {
            // const decodedToken = await this.jwtService.decode(token);
            // const userId = decodedToken["user_id"]; 

            const {room_name, client_number, bed_room, bed, bath_room, description, price, washing_machine, iron, tivi, air_conditioner, wifi, kitchen, parking, pool, location_id, image} = room;
            
            let newRoom = {
                room_name, client_number, bed_room, bed, bath_room, description, price, washing_machine, iron, tivi, air_conditioner, wifi, kitchen, parking, pool, location_id, image
            }

            let checkLocation = await this.prisma.location.findFirst({
                where: {
                    location_id
                }
            }); 

            if (checkLocation) {
                await this.prisma.rooms.create({
                    data: newRoom
                }); 
    
                return {
                    statusCode: 201,
                    message: "Create room successfully",
                    content: newRoom,
                    dateTime: new Date().toISOString()
                }
            } else {
                throw new NotFoundException({
                    statusCode: 404,
                    message: "Request is invalid",
                    content: "Location not found",
                    dateTime: new Date().toISOString()
                })
            }
        } catch (err) {
            throw new HttpException(err.response, err.status); 
        }
    }
}
