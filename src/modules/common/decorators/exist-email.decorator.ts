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
export class IsEmailNotExistConstraint implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  validate(email: any, args: ValidationArguments) {
    return this.usersService.findByEmailAndProvider(email).then(user => {
      return !user;
    });
  }

  defaultMessage(args: ValidationArguments) {
    return 'USER.EMAIL_EXISTS';
  }
}

export function IsNotExistEmail(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailNotExistConstraint,
    });
  };
}

export class IsEmailExistConstraint implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  validate(email: any, args: ValidationArguments) {
    return this.usersService.findByEmailAndProvider(email).then(user => {
      return !!user;
    });
  }

  defaultMessage(args: ValidationArguments) {
    return 'USER.EMAIL_NOT_EXISTS';
  }
}

export function IsExistEmail(validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistConstraint,
    });
  };
}
