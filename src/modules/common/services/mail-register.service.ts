import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

import { MailerService } from '@nestjs-modules/mailer';
import * as moment from 'moment';
import * as shortid from 'shortid';
import { CacheService } from '../services/cache-service.service';
import { Users } from 'src/modules/users/entities/users.entity';
import { SNS, Credentials } from 'aws-sdk';
@Injectable()
export class MailRegisterService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly cacheService: CacheService,
  ) {}

  private getSNS() {
    const accessKeyId = process.env.MAILDEV_INCOMING_USER;
    const secretAccessKey = process.env.MAILDEV_INCOMING_PASS;
    const region = process.env.MAIL_REGION;

    const credentials = new Credentials({
      accessKeyId,
      secretAccessKey,
    });

    return new SNS({ credentials, region, apiVersion: 'latest' });
  }

  public async sendRegisterUserWithPhone(user: Users) {
    // Load the AWS SDK for Node.js

    // // Set region
    // AWS.config.update({ region: 'ap-northeast-1' });

    // Create publish parameters
    var params = {
      Message: 'TEXT_MESSAGE' /* required */,
      PhoneNumber: '0981931916',
    };

    // Create promise and SNS service object
    var publishTextPromise = this.getSNS().publish(params).promise();

    // Handle promise's fulfilled/rejected states
    publishTextPromise
      .then(function (data) {
        console.log('MessageID is ' + data.MessageId);
      })
      .catch(function (err) {
        console.error(err, err.stack);
      });
  }

  public async sendRegisterUser(user: Users) {
    const activateCode = shortid.generate();
    await this.cacheService.set(
      `Activate-Code-User${user.id}`,
      activateCode,
      Number(process.env.ACTIVE_CODE_EXPIRED),
    );
    this.mailerService
      .sendMail({
        to: user.email,
        from: `"${process.env.MAIL_SENDER_NAME}" <${process.env.MAIL_SENDER}>`,
        subject: 'Verify registration',
        text: 'welcome',
        template: './register.pug',
        context: {
          email: user.email,
          user_name: user.userName,
          authentication_url: `${
            process.env.FE_BASE_URL + process.env.FE_VERIFY_USER_URL
          }?user_id=${user.id}&activate_code=${activateCode}`,
          date: moment().format('DD/MM/YYYY HH:mm:ss'),
          mail_support: process.env.MAIL_SUPPORT,
        },
      })
      .catch(e => {
        console.log('error send mail to verify register user', e);
        Logger.error('error send mail to verify register user', e);
      });
  }

  public async sendForgotPassword(user: Users) {
    const activateCode = shortid.generate();
    await this.cacheService.set(
      `Activate-Code-User${user.id}`,
      activateCode,
      Number(process.env.ACTIVE_CODE_EXPIRED),
    );
    this.mailerService
      .sendMail({
        to: user.email,
        from: `"${process.env.MAIL_SENDER_NAME}" <${process.env.MAIL_SENDER}>`,
        subject: 'Reset Password',
        text: 'reset password',
        template: './forgot-password-template.pug',
        context: {
          to: user.email,
          user_name: user.userName,
          authentication_url: `${process.env.FE_BASE_URL + process.env.FE_FORGOT_PASSWORD_URL}?id=${
            user.id
          }&activate_code=${activateCode}`,
          mail_support: process.env.MAIL_SUPPORT,
        },
        date: moment().format('DD/MM/YYYY HH:mm:ss'),
      })
      .catch(e => {
        console.log('error send mail to verify forgot password', e);
        Logger.error('error send mail to verify forgot password', e);
      });
  }
}
