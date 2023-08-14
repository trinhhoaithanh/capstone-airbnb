import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
    @ApiProperty()
    location_name: string; 

    @ApiProperty()
    province: string; 

    @ApiProperty()
    nation: string; 

    @ApiProperty()
    location_image: string; 
}
