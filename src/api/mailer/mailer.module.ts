import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as MailModule } from '@nestjs-modules/mailer';
import { MailerProcessor } from './mailer.processor';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('EMAIL_HOST'),
            port: configService.get<number>('EMAIL_PORT'),
            secure: false, // true for 465, false for other ports
            auth: {
              user: configService.get<string>('EMAIL_ID'), // generated ethereal user
              pass: configService.get<string>('EMAIL_PASS'), // generated ethereal password
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService, MailerProcessor],
  exports: [MailerService],
})
export class MailerModule {}
