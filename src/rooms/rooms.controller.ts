import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags("Rooms")
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // Get rooms 
  @Get("get-rooms")
  getRooms() {
    return this.roomsService.getRooms(); 
  }

  // Create room 
  @ApiHeader({
    name: "token",
    description: "Your authentication token",
    required: true
  })
  @Post("create-room")
  createRoom(
    @Headers("token") token,
    @Body() room: Room
  ) {
    return this.roomsService.createRoom(token, room); 
  }

  // Get room by room_id
  @Get("get-room-by-id/:room_id")
  getRoomById(@Query("room_id") roomId: number) {
    return this.roomsService.getRoomById(+roomId); 
  }
}
