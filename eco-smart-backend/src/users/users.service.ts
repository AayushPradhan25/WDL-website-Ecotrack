import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        ecoCoins: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        ecoCoins: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async toggleStatus(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id },
      data: { status: user.status === 'active' ? 'banned' : 'active' },
    });
  }

  async addCoins(id: number, coins: number) {
    return this.prisma.user.update({
      where: { id },
      data: { ecoCoins: { increment: coins } },
    });
  }

  getLeaderboard() {
    return this.prisma.user.findMany({
      where: { role: 'USER' },
      orderBy: { ecoCoins: 'desc' },
      take: 20,
      select: { id: true, name: true, ecoCoins: true },
    });
  }

  async update(id: number, data: { name?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        ecoCoins: true,
      },
    });
  }
}
