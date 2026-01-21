import nodemailer from 'nodemailer';

export class MailService {
  private readonly transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }
  async sendVerificationCode(email: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: `"PickUp" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: `PickUp- Email Verification`,
        text: `Your verification code is: ${code}`,
        html: this.getVerificationCodeTemplate(code),
      });
      console.log(`Verification code sent to ${email}`);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error)
        console.log(
          `Failed to send code to ${email}: ${error.message}`,
          error.stack,
        );
      return false;
    }
  }
  private getVerificationCodeTemplate(code: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333;">PickUp - Email Verification</h2>
        <p>Please use the following code to verify your email address:</p>
        <div style="background-color: #f8f8f8; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <p>Thank you,<br>The PickUp Team</p>
      </div>
    `;
  }
}
