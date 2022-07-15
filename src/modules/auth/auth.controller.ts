import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { VerifyUserDto } from './dto/verify-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthTokenOutput } from './dto/auth-token-output.dto';
import { JwtRefreshGuard } from 'src/modules/common/guards/jwt-refresh.guard';
import { EmailOrPhoneExistDto } from '../users/dto/email-or-phone.dto';
import { ChangePasswordForgotDto } from './dto/change-password-forgot.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify')
  verifyUser(@Query() data: VerifyUserDto): Promise<boolean> {
    return this.authService.verifyUser(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto): Promise<AuthTokenOutput> {
    return this.authService.login(data);
  }

  @Post('forgot-password')
  @UseInterceptors(ClassSerializerInterceptor)
  async forgotPassword(@Body() data: EmailOrPhoneExistDto) {
    return this.authService.forgotPassword(data);
  }

  @Put('change-password-forgot')
  @UseInterceptors(ClassSerializerInterceptor)
  async changePasswordForgot(@Body() data: ChangePasswordForgotDto): Promise<boolean> {
    return this.authService.changePasswordForgot(data);
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshToken(@Body() data: AuthTokenOutput): Promise<AuthTokenOutput> {
    return this.authService.refreshToken(data);
  }
}
