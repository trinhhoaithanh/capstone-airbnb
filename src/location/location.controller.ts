import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags("Location")
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // Get locations 
  @ApiHeader({
    name: "token",
    description: "Your authentication token",
    required: true
  })
  @Get("get-locations")
  getLocations(@Headers("token") token) {
    return this.locationService.getLocations(token); 
  }

  // Create location
  @ApiHeader({
    name: "token",
    description: "Your authentication token",
    required: true
  })
  @Post("create-location")
  createLocation(@Headers("token") token, @Body() location: Location) {
    return this.locationService.createLocation(token, location); 
  }
}
