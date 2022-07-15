import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entities/users.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CustomErrorMessage } from '../common/constants/error-message';
import { hashMatching } from '../common/utility/hash.utility';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatus } from './enums';
import * as moment from 'moment';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  private readonly logger = new Logger(UsersService.name);

  async findOne(id: number, isActive: boolean = false): Promise<Users> {
    const user = isActive
      ? await this.usersRepository.findOne({ id, status: UserStatus.ACTIVE })
      : await this.usersRepository.findOne({ id });

    if (!user) throw new NotFoundException(CustomErrorMessage['USER.USER_NOT_FOUND']);
    return user;
  }

  async getUserProfile(id: number): Promise<Users> {
    const user = await this.usersRepository.findOne({ id });
    if (!user) throw new NotFoundException(CustomErrorMessage['USER.USER_NOT_FOUND']);
    return user;
  }

  async update(user: Users) {
    return this.usersRepository.save(user);
  }

  findByPhoneNumber(phone: string, isActive: boolean = false): Promise<Users> {
    return isActive
      ? this.usersRepository.findOne({ phone, status: UserStatus.ACTIVE })
      : this.usersRepository.findOne({ phone });
  }

  findByEmailAndProvider(email: string, isActive: boolean = false): Promise<Users> {
    return isActive
      ? this.usersRepository.findOne({ email, status: UserStatus.ACTIVE })
      : this.usersRepository.findOne({ email });
  }

  async register(data: CreateUserDto) {
    return this.usersRepository.save(await data.toEntity());
  }

  async changePassword(user: Users, data: ChangePasswordDto): Promise<boolean> {
    const { currentPassword, newPassword } = data;
    if (currentPassword === newPassword) {
      throw new BadRequestException(
        CustomErrorMessage['USER.NEW_PASSWORD_CAN_NOT_BE_THE_SAME_AS_OLD_PASSWORD'],
      );
    }
    const checkOldPassword = await hashMatching(currentPassword, user.password);
    if (!checkOldPassword) {
      throw new BadRequestException(CustomErrorMessage['USER.OLD_PASSWORD_INCORRECT']);
    }

    await this.usersRepository.save(await data.toEntity(user));
    return true;
  }

  updateTimeLastLogin(userId: number) {
    const now = moment().toISOString(true);
    return this.usersRepository.update(
      { id: userId },
      {
        lastLogin: now,
      },
    );
  }
}
