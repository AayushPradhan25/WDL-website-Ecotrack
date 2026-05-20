import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.complaint.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByUser(userId: number) {
    return this.prisma.complaint.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const c = await this.prisma.complaint.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!c) throw new NotFoundException('Complaint not found');
    return c;
  }

  create(userId: number, data: { title: string; description: string; location: string }) {
    return this.prisma.complaint.create({
      data: {
        ...data,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async updateStatus(id: number, status: string) {
    await this.findOne(id);
    return this.prisma.complaint.update({ where: { id }, data: { status } });
  }
}
