import { Body, Controller, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateLocationDto } from './dto/update-location.dto';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // Get locations
  @Get('get-locations')
  getLocations() {
    return this.locationService.getLocations();
  }

  // Create location
  @ApiHeader({
    name: 'token',
    description: 'Your authentication token',
    required: true,
  })
  @Post('create-location')
  createLocation(@Headers('token') token, @Body() location: Location) {
    return this.locationService.createLocation(token, location);
  }

  // Get location by location_id
  @ApiParam({name:'location_id'})
  @Get("get-location-by-location-id/:location_id")
  getLocationByLocationId(@Param('location_id') locationId){
    return this.locationService.getLocationByLocationId(Number(locationId))
  }

  // Update location by location_id
  @ApiHeader({
    name: "token",
    description: "Your authentication token",
    required: true
  })
  @Put("update-location/:location_id")
  updateLocation(
    @Headers("token") token, 
    @Param("location_id") locationId: number,
    @Body() updateLocation: UpdateLocationDto
  ) {
    return this.locationService.updateLocation(token, locationId, updateLocation); 
  }
  // Pagination of location
  @Get('get-location-pagination')
  getLocationPagination(@Query('pageIndex') pageIndex:number, @Query('pageSize') pageSize:number, @Query('keyword') keyWord:string){
    return this.locationService.getLocationPagination(pageIndex, pageSize, keyWord)
  }
}
