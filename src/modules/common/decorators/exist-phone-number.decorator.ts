import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPhoneNumberNotExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  validate(phone: any, args: ValidationArguments) {
    return this.usersService.findByPhoneNumber(phone).then(user => {
      return !user;
    });
  }

  defaultMessage(args: ValidationArguments) {
    return 'USER.PHONE_NUMBER_EXISTS';
  }
}

export function IsNotExistPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberNotExistConstraint,
    });
  };
}

export class IsPhoneNumberExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  validate(phone: any, args: ValidationArguments) {
    return this.usersService.findByPhoneNumber(phone).then(user => {
      return !!user;
    });
  }

  defaultMessage(args: ValidationArguments) {
    return 'USER.PHONE_NUMBER_NOT_EXISTS';
  }
}

export function IsExistPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberExistConstraint,
    });
  };
}
