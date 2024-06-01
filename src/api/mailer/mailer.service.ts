import { Injectable } from '@nestjs/common';
import { MailerService as MailService } from '@nestjs-modules/mailer';

interface ISendMail {
  applyJobId: number;
  to: string; // List of receivers email address
  from?: string; // Senders email address
  subject: string; // Subject line
  text: string; // plaintext body
  html: string; // HTML body content
  attachments: IAttachment[];
}
interface IAttachment {
  filename: string;
  contents: string;
  contentTransferEncoding:
    | '7bit'
    | 'base64'
    | 'quoted-printable'
    | false
    | undefined;
  contentType: string;
}

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: MailService) {}
  public async sendMailResetPassword(body: {
    email: string;
    userId: number;
    token: string;
  }) {
    const resetLink = `http://localhost:3000/forgot-password/${body.token}`; // Assume you have a frontend route to handle this
    // try {
    await this.mailerService.sendMail({
      to: body.email, // List of receivers email address
      from: '"No Reply" <no-reply@gmail.com>', // Senders email address
      subject: 'Reset your password', // Subject line
      text: `You requested a password reset. Click here to reset: ${resetLink}`, // plaintext body
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset.</p>`, // HTML body contents
    });
    // .catch((err) => {
    //   console.log('catch', err);
    // })
    // .then((v) => {
    //   console.log('value', v);
    // });
    // } catch (error) {
    //   throw error;
    // }
  }
}
