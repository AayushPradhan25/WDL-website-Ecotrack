import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  CreateTruckRequestDto,
  UpdateTruckRequestDto,
} from './dto/truck-request.dto';

@Injectable()
export class TruckRequestsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async create(userId: number, dto: CreateTruckRequestDto) {
    return this.prisma.truckRequest.create({
      data: {
        ...dto,
        userId,
        preferredDate: dto.preferredDate
          ? new Date(dto.preferredDate)
          : undefined,
      },
      include: { user: true },
    });
  }

  async findAll() {
    return this.prisma.truckRequest.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.truckRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.truckRequest.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id: number, dto: UpdateTruckRequestDto) {
    const updated = await this.prisma.truckRequest.update({
      where: { id },
      data: dto,
      include: { user: true },
    });

    // Notify user when admin changes status
    if (dto.status && updated.userId) {
      const statusMsg: Record<string, string> = {
        PENDING: 'Pending',
        APPROVED: 'Approved ✅',
        REJECTED: 'Rejected ❌',
        COMPLETED: 'Completed 🚛',
      };
      await this.notifications.create(
        updated.userId,
        'Truck Request Updated',
        `Your truck request "${updated.title}" status is now ${statusMsg[dto.status] ?? dto.status}.`,
        'truck',
      );
    }

    return updated;
  }
}
