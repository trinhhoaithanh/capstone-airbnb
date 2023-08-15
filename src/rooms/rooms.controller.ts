import { Body, Controller, Delete, Get, Header, Headers, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ApiBody, ApiConsumes, ApiHeader, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';
import { FileUploadDto } from 'src/users/dto/fileUploadDto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

  // Update room by room id (only admin can update it)
  @ApiHeader({
    name: 'token',
    description: 'Your authentication token',
    required: true,
  })
  @ApiParam({
    name:'room_id'
  })
  @Put('update-room-by-room-id/:room_id')
  updateRoomByRoomId(@Param('room_id') roomId, @Headers('token') token, @Body() roomInfo:Room)
  {
    return this.roomsService.updateRoomByRoomId(Number(roomId), token,roomInfo)
  }

  // Delete room by room id
  @ApiParam({
    name:'room_id',
    required:true
  })
  @ApiHeader({
    name: 'token',
    description: 'Your authentication token',
    required: true,
  })
  @Delete('delete-room-by-room-id/:room_id')
  deleteRoomByRoomId(@Param('room_id') roomId, @Headers('token') token){
    return this.roomsService.deleteRoomByRoomId(Number(roomId),token)
  }

  // Upload room's image
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          callback(null, new Date().getTime() + file.originalname);
        },
      }),
    }),
  )
  @ApiHeader({
    name: 'token',
    description: 'Your authentication token',
    required: true,
  })
  @ApiQuery({name:'room_id'})
  @Post('upload-room-img')
  uploadAvatar(
    @Query('room_id') roomId:number,
    @UploadedFile() file: Express.Multer.File,
    @Headers('token') token,
  ) {
    return this.roomsService.uploadRoomImg(token, file,Number(roomId));
  }
}
