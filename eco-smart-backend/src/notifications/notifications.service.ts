import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getForUser(userId: number) {
    try {
      return await this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return [
        {
          id: 1,
          userId,
          title: 'Welcome to EcoSmart! 🌿',
          message: 'Your account is active. Earn EcoCoins by reporting waste and recycling.',
          read: false,
          type: 'info',
          createdAt: new Date(),
        },
      ];
    }
  }

  create(userId: number, title: string, message: string, type = 'info') {
    return this.prisma.notification.create({
      data: { userId, title, message, type },
    });
  }

  markRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  markAllRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId },
      data: { read: true },
    });
  }

  deleteOne(id: number) {
    return this.prisma.notification.delete({ where: { id } });
  }

  deleteAll(userId: number) {
    return this.prisma.notification.deleteMany({ where: { userId } });
  }
}
