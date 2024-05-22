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
  public async sendMailResetPassword(body: { email: string; userId: number }) {
    // try {
    await this.mailerService.sendMail({
      to: body.email, // List of receivers email address
      from: '"No Reply" <no-reply@gmail.com>', // Senders email address
      subject: 'เปลี่ยนรหัสผ่าน', // Subject line
      text: `http://localhost:3000/forgot-password/${body.userId}`, // plaintext body
      html: '', // HTML body contents
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
