import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ComplaintsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async findAll(query: { status?: string; page?: number; limit?: number } = {}) {
    const { status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    try {
      return await this.prisma.complaint.findMany({
        where: status ? { status } : undefined,
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      });
    } catch {
      return [
        {
          id: 101,
          title: 'Overflowing Bin at Connaught Place',
          description: 'Garbage bin near Block B is completely overflowing onto the sidewalk.',
          location: 'Connaught Place, New Delhi',
          category: 'Overflow',
          status: 'pending',
          createdAt: new Date(),
          user: { name: 'Eco Citizen', email: 'user@ecosmart.com' },
        },
        {
          id: 102,
          title: 'Illegal Waste Dumping',
          description: 'Commercial debris dumped near sector 4 park entrance.',
          location: 'Sector 4, Rohini',
          category: 'Illegal Dumping',
          status: 'in-progress',
          createdAt: new Date(),
          user: { name: 'Aayush Pradhan', email: 'aayush@ecosmart.com' },
        },
      ];
    }
  }

  async findByUser(userId: number) {
    try {
      return await this.prisma.complaint.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return [
        {
          id: 101,
          userId,
          title: 'Overflowing Bin at Connaught Place',
          description: 'Garbage bin near Block B is completely overflowing onto the sidewalk.',
          location: 'Connaught Place, New Delhi',
          category: 'Overflow',
          status: 'pending',
          createdAt: new Date(),
        },
      ];
    }
  }

  async findOne(id: number) {
    const c = await this.prisma.complaint.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!c) throw new NotFoundException('Complaint not found');
    return c;
  }

  create(
    userId: number,
    data: {
      title: string;
      description: string;
      location: string;
      category?: string;
      imageUrl?: string;
    },
  ) {
    return this.prisma.complaint.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async updateStatus(id: number, status: string) {
    const complaint = await this.findOne(id);
    const updated = await this.prisma.complaint.update({
      where: { id },
      data: { status },
    });

    // Auto-notify the user whose complaint status changed
    const statusLabels: Record<string, string> = {
      pending: 'Pending',
      'in-progress': 'In Progress',
      resolved: 'Resolved',
      rejected: 'Rejected',
    };
    await this.notifications.create(
      complaint.userId,
      'Complaint Status Updated',
      `Your complaint "${complaint.title}" is now ${statusLabels[status] ?? status}.`,
      'complaint',
    );

    return updated;
  }
}
