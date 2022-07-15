import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Users } from '../entities/users.entity';
import { PASSWORD_RULE } from '../constants';
import { hashPassword } from 'src/modules/common/utility/hash.utility';
import { EmailOrPhoneNotExistDto } from './email-or-phone.dto';

export class CreateUserDto extends EmailOrPhoneNotExistDto {
  @ApiProperty({ required: true, description: 'Password' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  @Matches(PASSWORD_RULE)
  password: string;

  // @ApiProperty({ required: true, description: 'Confirm Password' })
  // @IsNotEmpty()
  // @IsString()
  // @MatchConfirmPassword('password')
  // confirmedPassword: string;

  async toEntity(): Promise<Users> {
    const user = new Users();

    if (this.email) {
      user.email = this.email;
    } else {
      user.phone = this.phone;
    }

    user.password = await hashPassword(this.password);
    return user;
  }
}
