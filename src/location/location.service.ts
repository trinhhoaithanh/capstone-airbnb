import { responseArray } from './../util/response-template';
import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/enum/roles.enum';
import { responseObject } from 'src/util/response-template';

@Injectable()
export class LocationService {
  prisma = new PrismaClient();
  constructor(private jwtService: JwtService) { }

  // Get locations
  async getLocations() {
    try {
      const locations = await this.prisma.location.findMany(); 
      return responseArray(200, 'Get locations successfully!', locations.length, locations); 
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Create location
  async createLocation(token, location) {
    try {
      const userRole = await this.jwtService.decode(token)['user_role']; 
      const userId = await this.jwtService.decode(token)['user_id']; 

      let checkUser = await this.prisma.users.findUnique({
        where: {
          user_id: userId
        }
      }); 

      if (checkUser) {
        if (userRole === Roles.ADMIN) {
          const { location_name, province, nation, location_image } = location;

          let newLocation = {
            location_name,
            province,
            nation,
            location_image,
          };

          const create = await this.prisma.location.create({
            data: newLocation,
          });

          return responseObject(201, "Create location successfully!", create);
        } else {
          throw new ForbiddenException(responseObject(403, "Request is invalid", "You don't have permission to access!"));
        }
      } else {
        throw new NotFoundException(responseObject(404, "Request is invalid", "User doesn't exist!")); 
      } 
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get location by location_id
  async getLocationByLocationId(locationId) {
    try {
      let checkLocation = await this.prisma.location.findFirst({
        where: {
          location_id: locationId
        }
      })

      if (checkLocation) {
        return {
          statusCode: 200,
          message: 'Get location successfully!',
          content: checkLocation,
          dateTime: new Date().toISOString(),
        };
      }
      else {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Request is invalid',
          content: 'Location is not found',
          dateTime: new Date().toISOString(),
        });
      }
    }
    catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Update location by location_id
  async updateLocation(token, locationId, updateLocation) {
    try {
      const decodedToken = await this.jwtService.decode(token);
      const userRole = decodedToken["user_role"];

      let { location_name, province, nation, location_image } = updateLocation;

      let newLocation = {
        location_name,
        province,
        nation,
        location_image
      };

      if (userRole === Roles.ADMIN) {
        let checkLocation = await this.prisma.location.findUnique({
          where: {
            location_id: +locationId
          }
        });
        if (checkLocation) {
          const newUpdate = await this.prisma.location.update({
            where: {
              location_id: +locationId
            },
            data: newLocation
          });
          return responseObject(200, "Update location successfully!", newUpdate);
        } else {
          throw new NotFoundException(responseObject(404, "Request is invalid", "Location not found!"));
        }
      } else {
        throw new ForbiddenException(responseObject(403, "Request is invalid", "You don't have permission to access!"));
      }
    }
    catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Get location by pagination
  async getLocationPagination(pageIndex, pageSize, keyWord) {
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

  // Upload image for location
  async uploadImage(token, locationId, file) {
    try {
      const decodedToken = await this.jwtService.decode(token);
      const userRole = decodedToken['user_role'];

      let checkLocation = await this.prisma.location.findUnique({
        where: {
          location_id: +locationId
        }
      });

      if (checkLocation) {
        if (userRole === Roles.ADMIN) {
          let uploadImg = await this.prisma.location.update({
            where: {
              location_id: +locationId
            },
            data: {
              location_image: file.filename
            }
          });
          return responseObject(200, "Upload image successfully!", uploadImg);
        } else {
          throw new ForbiddenException(responseObject(403, "Request is invalid", "You don't have permission to access!"));
        }
      } else {
        throw new NotFoundException(responseObject(404, "Request is invalid", "Location not found!"));
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Delete location
  async deleteLocation(token, locationId) {
    try {
      const decodedToken = await this.jwtService.decode(token);
      const userRole = decodedToken['user_role'];

      let checkLocation = await this.prisma.location.findUnique({
        where: {
          location_id: +locationId
        }
      });

      if (checkLocation) {
        if (userRole === Roles.ADMIN) {
          // Delete location_id if exists in rooms model as foreign key 
          let checkLocationRoom = await this.prisma.rooms.findFirst({
            where: {
              location_id: +locationId
            }
          });
          if (checkLocationRoom) {
            await this.prisma.rooms.deleteMany({
              where: {
                location_id: +locationId
              }
            });

            // Delete location_id in location model as primary key 
            const deletedLocation = await this.prisma.location.delete({
              where: {
                location_id: +locationId
              }
            });
            return responseObject(200, "Delete location successfully!", deletedLocation);
          }
        } else {
          throw new ForbiddenException(responseObject(403, "Request is invalid", "You don't have permission to access!"));
        }
      } else {
        throw new NotFoundException(responseObject(404, "Request is invalid", "Location not found!"));
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

}
