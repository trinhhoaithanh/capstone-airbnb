import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { CreateRoomDto } from './dto/create-room.dto';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // Get rooms
  @Get('get-rooms')
  getRooms() {
    return this.roomsService.getRooms();
  }

  // Create room 
  @ApiHeader({
    name: 'token',
    description: 'Your authentication token',
    required: true,
  })
  @Post('create-room')
  createRoom(@Headers('token') token, @Body() room: CreateRoomDto) {
    return this.roomsService.createRoom(token, room);
  }

  // Get rooms by search pagination
  @Get('get-rooms-by-pagination')
  getRoomsByPagination(
    @Query('pageIndex') pageIndex: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword: string,
  ) {
    return this.roomsService.getRoomsByPagination(pageIndex, pageSize, keyword);
  }

  // Get room by room_id
  @Get('get-room-by-id/:room_id')
  getRoomById(@Query('room_id') roomId: number) {
    return this.roomsService.getRoomById(+roomId);
  }

  // Get room by location_id
  @Get('get-room-by-location-id')
  getRoomByLocationId(@Query('location_id') locationId: number) {
    return this.roomsService.getRoomByLocationId(Number(locationId));
  }
}
