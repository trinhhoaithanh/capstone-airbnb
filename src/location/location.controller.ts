import { Body, Controller, Headers, Post } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { ApiHeader } from '@nestjs/swagger';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

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
