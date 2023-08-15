import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/enum/roles.enum';
import { responseObject } from 'src/util/response-template';

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
      const userRole = decodedToken['user_role'];

      if(userRole === Roles.ADMIN){
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
      }
      else {
        throw new ForbiddenException(responseObject(403, "Request is invalid", "You don't have permission to access!")); 
      }
      
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

  // Get location by pagination
  async getLocationPagination(pageIndex, pageSize, keyWord){
    try {
      const startIndex = (pageIndex - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      let filteredItems = await this.prisma.location.findMany({
        where: {
          location_name: {
            contains: keyWord,
          },
        },
      });

      if (keyWord) {
        filteredItems = filteredItems.filter((item) =>
          item.location_name.toLowerCase().includes(keyWord.toLowerCase()),
        );
      }

      const itemSlice = filteredItems.slice(startIndex, endIndex);
      return {
        statusCode: 200,
        message: 'Get locations successfully',
        content: {
          pageIndex,
          pageSize,
          totalRow: filteredItems.length,
          keyword: `Location name LIKE %${keyWord}%`,
          data: itemSlice,
        },
        dateTime: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
