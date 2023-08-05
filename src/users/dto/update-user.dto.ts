import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    email:String;
  
    @ApiProperty()
    full_name:String;
  
    @ApiProperty()
    birth_day:String;
  
    @ApiProperty()
    gender:Boolean;
  
    @ApiProperty()
    user_role:String;
  
    @ApiProperty()
    phone:String;
}
