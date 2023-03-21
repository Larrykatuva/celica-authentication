

export default abstract class SendEmail {
  abstract sendEmail(to: string, subject: string, body: string): Promise<void>;
}
