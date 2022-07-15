import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { EMAIL_RULE, PHONE_RULE } from 'src/modules/users/constants';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailOrPhoneNumberAlreadyExistConstraint implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  validate(emailOrPhone: any, args: ValidationArguments) {
    const regexpEmail = new RegExp(EMAIL_RULE);
    const regexpPhone = new RegExp(PHONE_RULE);
    if (regexpEmail.test(emailOrPhone)) {
      return this.usersService.findByEmailAndProvider(emailOrPhone).then(user => {
        return !user;
      });
    } else if (regexpPhone.test(emailOrPhone)) {
      return this.usersService.findByPhoneNumber(emailOrPhone).then(user => {
        return !user;
      });
    } else {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const regexpEmail = new RegExp(EMAIL_RULE);
    const regexpPhone = new RegExp(PHONE_RULE);

    if (regexpEmail.test(args.value)) {
      return 'USER.EMAIL_EXISTS';
    } else if (regexpPhone.test(args.value)) {
      return 'USER.PHONE_NUMBER_EXISTS';
    } else {
      return 'USER.EMAIL_OR_PHONE_INVALID';
    }
  }
}

export function IsExistEmailOrPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailOrPhoneNumberAlreadyExistConstraint,
    });
  };
}
