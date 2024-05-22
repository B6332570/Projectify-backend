import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from './mailer.service';

@Processor('send_mail')
export class MailerProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process('send_reset_password')
  handleSendMailResetPassword(job: Job) {
    this.mailerService.sendMailResetPassword(job.data);
  }
}
