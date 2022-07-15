import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomErrorMessage } from 'src/modules/common/constants/error-message';
import { CacheService } from 'src/modules/common/services/cache-service.service';
import { hashMatching } from 'src/modules/common/utility/hash.utility';
import { Users } from 'src/modules/users/entities/users.entity';
import { UserStatus, UserVerifyEmail, UserVerifyPhone } from 'src/modules/users/enums';
import { UsersService } from 'src/modules/users/users.service';
import { MailRegisterService } from '../common/services/mail-register.service';
import { EmailOrPhoneExistDto } from '../users/dto/email-or-phone.dto';
import { AuthTokenOutput } from './dto/auth-token-output.dto';
import { ChangePasswordForgotDto } from './dto/change-password-forgot.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyUserDto } from './dto/verify-user.dto';

export interface JWTPayload {
  sub: number;
  roles: number;
  email: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailRegisterService: MailRegisterService,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
  ) {}

  handleJwt(user: Users): AuthTokenOutput {
    const payload: JWTPayload = {
      sub: user.id,
      roles: user.role,
      email: user.email,
      phone: user.phone,
    };

    return {
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC),
      }),
      accessToken: this.jwtService.sign(payload, {
        expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXP_IN_SEC),
      }),
    };
  }

  async validateUser(email, password): Promise<any> {
    const user = await this.usersService.findByEmailAndProvider(email, true);

    if (!user) {
      return;
    }

    const isPasswordMatched = await hashMatching(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async verifyUser(data: VerifyUserDto): Promise<boolean> {
    const { userId, activateCode } = data;
    const checkActivateCode = await this.cacheService.get(`Activate-Code-User${userId}`);

    if (checkActivateCode !== activateCode) {
      throw new NotFoundException(CustomErrorMessage['AUTH.WRONG_ACTIVATE_CODE']);
    }

    let isRegisterEmail = isNaN(Number(activateCode));

    const user = await this.usersService.findOne(userId);
    user.status = UserStatus.ACTIVE;

    if (isRegisterEmail) {
      user.emailVerified = UserVerifyEmail.YES;
    } else {
      user.phoneVerified = UserVerifyPhone.YES;
    }

    await Promise.all([
      this.usersService.update(user),
      this.cacheService.del(`Activate-Code-User${userId}`),
    ]);

    return true;
  }

  async login(data: LoginDto): Promise<AuthTokenOutput> {
    const { password, email, phone } = data;

    const user = email
      ? await this.usersService.findByEmailAndProvider(email, true)
      : await this.usersService.findByPhoneNumber(phone, true);
    if (!user) throw new NotFoundException(CustomErrorMessage['USER.USER_NOT_FOUND']);
    const isMatch = await hashMatching(password, user.password);
    if (!isMatch) throw new BadRequestException(CustomErrorMessage['AUTH.WRONG_PASSWORD']);

    const authToken = this.handleJwt(user);

    await this.cacheService.set(
      `Refresh-Token-${authToken.refreshToken}`,
      user.id.toString(),
      Number(process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC),
    );

    return authToken;
  }

  async refreshToken(data: AuthTokenOutput): Promise<AuthTokenOutput> {
    const { refreshToken } = data;
    const userId = await this.cacheService.get(`Refresh-Token-${refreshToken}`);
    if (!userId) throw new BadRequestException(CustomErrorMessage['AUTH.TOKEN_EXPIRED']);
    const user = await this.usersService.findOne(Number(userId), true);
    const authToken = this.handleJwt(user);
    return authToken;
  }

  async getUserProfile(id: number): Promise<Users> {
    const [user] = await Promise.all([
      this.usersService.getUserProfile(id),
      this.usersService.updateTimeLastLogin(id),
    ]);

    return user;
  }

  async forgotPassword(data: EmailOrPhoneExistDto) {
    const { email, phone } = data;
    const user = email
      ? await this.usersService.findByEmailAndProvider(email, true)
      : await this.usersService.findByPhoneNumber(phone, true);

    if (email) {
      await this.mailRegisterService.sendForgotPassword(user);
    } else {
    }
    return true;
  }

  async changePasswordForgot(data: ChangePasswordForgotDto): Promise<boolean> {
    const { userId, activateCode } = data;
    const checkActivateCode = await this.cacheService.get(`Activate-Code-User${userId}`);

    if (checkActivateCode !== activateCode) {
      throw new NotFoundException(CustomErrorMessage['AUTH.WRONG_ACTIVATE_CODE']);
    }

    const user = await this.usersService.findOne(userId);
    await Promise.all([
      this.usersService.update(await data.toEntity(user)),
      this.cacheService.del(`Activate-Code-User${userId}`),
    ]);
    return true;
  }
}
