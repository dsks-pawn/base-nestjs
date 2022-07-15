import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';
import { IsExistEmail, IsNotExistEmail } from '../../common/decorators/exist-email.decorator';
import {
  IsNotExistPhoneNumber,
  IsExistPhoneNumber,
} from '../../common/decorators/exist-phone-number.decorator';

export class EmailOrPhoneNotExistDto {
  @ApiProperty({ description: 'Email' })
  @ValidateIf(o => !o.phone || o.email)
  @IsString()
  @IsEmail()
  @IsNotExistEmail()
  email: string;

  @ApiProperty({ description: 'Phone' })
  @ValidateIf(o => !o.email || o.phone)
  @IsString()
  @IsPhoneNumber('VN')
  @IsNotExistPhoneNumber()
  phone: string;
}

export class EmailOrPhoneExistDto {
  @ApiProperty({ description: 'Email' })
  @ValidateIf(o => !o.phone || o.email)
  @IsString()
  @IsEmail()
  @IsExistEmail()
  email: string;

  @ApiProperty({ description: 'Phone' })
  @ValidateIf(o => !o.email || o.phone)
  @IsString()
  @IsPhoneNumber('VN')
  @IsExistPhoneNumber()
  phone: string;
}
