import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocationService {
  prisma = new PrismaClient();
  constructor(private jwtService: JwtService) {}

  // Get locations
  async getLocations() {
    try {
      return {
        statusCode: 200,
        message: 'Get locations successfully!',
        content: await this.prisma.location.findMany(),
        dateTime: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Create location
  async createLocation(token, location) {
    try {
      const decodedToken = await this.jwtService.decode(token);
      const userId = decodedToken['user_id'];

      const { location_name, province, nation, location_image } = location;

      let newLocation = {
        location_name,
        province,
        nation,
        location_image,
      };

      await this.prisma.location.create({
        data: newLocation,
      });

      return {
        statusCode: 201,
        message: 'Create location successfully',
        content: newLocation,
        dateTime: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get location by location id
  async getLocationByLocationId(locationId){
    try{
      let checkLocation = await this.prisma.location.findFirst({
        where:{
          location_id:locationId
        }
      })
  
      if(checkLocation){
        return {
          statusCode: 200,
          message: 'Get location successfully!',
          content: checkLocation,
          dateTime: new Date().toISOString(),
        };
      }
      else{
        throw new NotFoundException({
          statusCode: 404,
          message: 'Request is invalid',
          content: 'Location is not found',
          dateTime: new Date().toISOString(),
        });
      }
    }
    catch(err){
      throw new HttpException(err.response, err.status);
    }
    
  }
}
