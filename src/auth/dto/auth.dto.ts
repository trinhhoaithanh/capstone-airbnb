import { ApiProperty } from "@nestjs/swagger";

class userType{
 
    @ApiProperty()
    email:String;
  
    @ApiProperty()
    pass_word:String;
  
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

class loginType{
    @ApiProperty({default: "ngan@gmail.com"})
    email:String

    @ApiProperty({default: "1234"})
    pass_word:String
}

export {userType, loginType}
