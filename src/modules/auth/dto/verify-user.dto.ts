import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  activateCode: string;
}
