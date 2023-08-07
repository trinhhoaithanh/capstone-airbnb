import { HttpException, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocationService {

    prisma = new PrismaClient();
    constructor(private jwtService: JwtService) {}

    // Create location
    async createLocation(token, location) {
        try {
            const decodedToken = await this.jwtService.decode(token);
            const userId = decodedToken["user_id"];

            const {location_name, province, nation, location_image} = location; 

            let newLocation = {
                location_name, 
                province, 
                nation, 
                location_image
            }; 

            await this.prisma.location.create({
                data: newLocation
            });

            return {
                statusCode: 201,
                message: "Create location successfully",
                content: newLocation,
                dateTime: new Date().toISOString()
            }
        } catch (err) {
            throw new HttpException(err.response, err.status);
        }
    }
}
