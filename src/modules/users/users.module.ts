import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IsEmailOrPhoneNumberAlreadyExistConstraint } from '../common/decorators/exist-email-or-phone.decorator';
import { UserSubscriber } from './entities/user.subscriber';
import {
  IsEmailExistConstraint,
  IsEmailNotExistConstraint,
} from '../common/decorators/exist-email.decorator';
import {
  IsPhoneNumberExistConstraint,
  IsPhoneNumberNotExistConstraint,
} from '../common/decorators/exist-phone-number.decorator';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository])],
  controllers: [UsersController],
  providers: [
    UserSubscriber,
    UsersService,
    IsEmailNotExistConstraint,
    IsEmailExistConstraint,
    IsPhoneNumberNotExistConstraint,
    IsPhoneNumberExistConstraint,
    IsEmailOrPhoneNumberAlreadyExistConstraint,
  ],
  exports: [UsersService],
})
export class UsersModule {}
