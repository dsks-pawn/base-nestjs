import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { MatchConfirmPassword } from 'src/modules/common/decorators/match-password.decorator';
import { hashPassword } from 'src/modules/common/utility/hash.utility';
import { PASSWORD_RULE } from '../constants';
import { Users } from '../entities/users.entity';

export class ChangePasswordDto {
  @ApiProperty({ required: true, description: 'Current password' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  @Matches(PASSWORD_RULE)
  currentPassword: string;

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
