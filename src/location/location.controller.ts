import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

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
}
