import { Connection, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { MailRegisterService } from 'src/modules/common/services/mail-register.service';

@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<Users> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private mailRegisterService: MailRegisterService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Users;
  }

  async afterInsert(event: InsertEvent<Users>) {
    if (event.entity.email) {
      await this.mailRegisterService.sendRegisterUser(event.entity);
    } else {
      await this.mailRegisterService.sendRegisterUserWithPhone(event.entity);
    }
  }
}
