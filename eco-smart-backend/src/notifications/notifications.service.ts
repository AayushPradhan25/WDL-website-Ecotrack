import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  getForUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: number, title: string, message: string) {
    return this.prisma.notification.create({ data: { userId, title, message } });
  }

  markRead(id: number) {
    return this.prisma.notification.update({ where: { id }, data: { read: true } });
  }

  markAllRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId },
      data: { read: true },
    });
  }
}
