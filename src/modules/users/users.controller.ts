import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserScope } from '../common/decorators/user.decorator';
import { Users } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() data: CreateUserDto): Promise<Users> {
    return this.usersService.register(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('change-password')
  async changePassword(
    @UserScope() user: Users,
    @Body() data: ChangePasswordDto,
  ): Promise<boolean> {
    return this.usersService.changePassword(user, data);
  }
}
