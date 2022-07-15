import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule, Global, HttpModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './services/cache-service.service';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailRegisterService } from 'src/modules/common/services/mail-register.service';
import { ConfigModule } from '@nestjs/config';

const providers = [CacheService, MailRegisterService];
@Global()
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      db: parseInt(process.env.REDIS_DB_CACHE, 10) || 0,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
          user: process.env.MAILDEV_INCOMING_USER,
          pass: process.env.MAILDEV_INCOMING_PASS,
        },
        debug: true,
      },
      template: {
        dir: `${process.cwd()}/src/modules/common/templates/`,
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [],
  providers: providers,
  exports: [...providers],
})
export class CommonModule {}
