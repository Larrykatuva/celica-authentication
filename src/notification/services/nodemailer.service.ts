import SendEmail from './email.service';
import nodemailer, {
  SentMessageInfo,
  TestAccount,
  Transporter,
} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodeMailerService extends SendEmail {
  constructor(private configService: ConfigService) {
    super();
  }
  /**
   * Generate test SMTP service account from ethereal.email
   * Only needed if you don't have a real mail account for testing
   * @private
   */
  async createTestAccount(): Promise<TestAccount> {
    return await nodemailer.createTestAccount();
  }

  /**
   * Create reusable transporter object using the default SMTP transport
   * @private
   */
  async createTransport(): Promise<Transporter<SMTPTransport.SentMessageInfo>> {
    const testAccount: TestAccount = await this.createTestAccount();
    return nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE'),
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  /**
   * Transport object to send the email.
   * @param to
   * @param subject
   * @param html
   * @private
   */
  private mailOptions(
    to: string,
    subject: string,
    html: any,
  ): { from: string; to: string; subject: string; html: any } {
    return {
      from: '"Fred Foo 👻" <foo@example.com>',
      to: to,
      subject: subject,
      html: html,
    };
  }

  /**
   * Send mail with defined transport object
   * @param to
   * @param subject
   * @param body
   */
  public async sendEmail(
    to: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const transport = await this.createTransport();
    transport.sendMail(
      this.mailOptions(to, subject, body),
      (error: Error | null, info: SentMessageInfo) => {
        console.log(error);
        console.log(info);
      },
    );
  }
}
