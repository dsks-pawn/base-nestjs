import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { PASSWORD_RULE } from 'src/modules/users/constants';
import { EmailOrPhoneExistDto } from 'src/modules/users/dto/email-or-phone.dto';

export class LoginDto extends EmailOrPhoneExistDto {
  @ApiProperty({ required: true, description: 'Password' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  @Matches(PASSWORD_RULE)
  password: string;
}
