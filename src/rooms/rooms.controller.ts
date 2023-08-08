import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
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
}
