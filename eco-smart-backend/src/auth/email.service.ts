import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // For development, you can use a test email or Gmail SMTP
    // To use Gmail: enable "Less secure app access" or use app password
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password',
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string, userName: string) {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/user/reset-password.html?token=${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@ecosmart.com',
      to: email,
      subject: 'EcoSmart - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🌿 EcoSmart</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
            <p style="color: #374151; font-size: 16px;">Hi ${userName},</p>
            <p style="color: #6b7280; line-height: 1.6;">You have requested to reset your password. Click the button below to proceed with resetting your password. This link will expire in 1 hour.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              If you didn't request this, please ignore this email. Your password won't change unless you click the link above.
            </p>
            
            <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
              <strong>Direct Link:</strong><br>
              <a href="${resetLink}" style="color: #22c55e; word-break: break-all;">${resetLink}</a>
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      // In development, don't throw error if email fails
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
      return false;
    }
  }
}
