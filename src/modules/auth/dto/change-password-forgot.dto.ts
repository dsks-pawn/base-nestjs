import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { MatchConfirmPassword } from 'src/modules/common/decorators/match-password.decorator';
import { PASSWORD_RULE } from 'src/modules/users/constants';
import { VerifyUserDto } from './verify-user.dto';
import { Users } from 'src/modules/users/entities/users.entity';
import { hashPassword } from 'src/modules/common/utility/hash.utility';

export class ChangePasswordForgotDto extends VerifyUserDto {
  @ApiProperty({ required: true, description: 'New password' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  @Matches(PASSWORD_RULE)
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MatchConfirmPassword('newPassword')
  confirmedNewPassword: string;

  async toEntity(user: Users): Promise<Users> {
    user.password = await hashPassword(this.newPassword);
    return user;
  }
}
