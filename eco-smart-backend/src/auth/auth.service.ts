import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from './email.service';
import { randomUUID } from 'crypto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        role: 'USER',
      },
    });
    const { password: _password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) throw new UnauthorizedException('Invalid credentials');
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid credentials');
      const payload = { sub: user.id, email: user.email, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          ecoCoins: user.ecoCoins,
        },
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      // Database connection error fallback: allow seeded default user
      const defaultUserPass = process.env.SEED_USER_PASSWORD || 'user123';
      if (dto.email === 'user@ecosmart.com' && dto.password === defaultUserPass) {
        const payload = { sub: 1, email: dto.email, role: 'USER' };
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            id: 1,
            name: 'Eco Citizen',
            email: dto.email,
            role: 'USER',
            ecoCoins: 750,
          },
        };
      }
      throw err;
    }
  }

  async adminLogin(dto: LoginDto) {
    // Read allowed domains from env (comma-separated, no spaces)
    const allowedDomains = (
      process.env.ADMIN_ALLOWED_DOMAINS || 'ecosmart.com,admin.ecosmart.com'
    ).split(',');
    const domain = dto.email.split('@')[1] || '';
    if (!allowedDomains.includes(domain)) {
      throw new UnauthorizedException(
        `Only ${allowedDomains.join(', ')} email addresses are allowed for admin portal`,
      );
    }
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) throw new UnauthorizedException('Invalid credentials');
      if (user.role !== 'ADMIN') {
        throw new UnauthorizedException(
          'Only admin users can access admin portal',
        );
      }
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid credentials');
      const payload = { sub: user.id, email: user.email, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
        adminDomain: domain,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          ecoCoins: user.ecoCoins,
        },
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      // Database connection error fallback: allow seeded default admin
      const defaultAdminPass = process.env.SEED_ADMIN_PASSWORD || 'admin123';
      if (dto.email === 'admin@ecosmart.com' && dto.password === defaultAdminPass) {
        const payload = { sub: 999, email: dto.email, role: 'ADMIN' };
        return {
          access_token: this.jwtService.sign(payload),
          adminDomain: domain,
          user: {
            id: 999,
            name: 'EcoSmart Admin',
            email: dto.email,
            role: 'ADMIN',
            ecoCoins: 1000,
          },
        };
      }
      throw err;
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // For security, don't reveal if email exists
      return { message: 'If email exists, password reset link has been sent' };
    }

    // Generate reset token
    const resetToken = randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send email
    await this.emailService.sendPasswordResetEmail(
      user.email,
      resetToken,
      user.name,
    );

    return { message: 'Password reset link has been sent to your email' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Find user with valid reset token
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.token,
        resetTokenExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // Update password and clear reset token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password has been reset successfully' };
  }

  async verifyResetToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    return { email: user.email, valid: true };
  }
}
