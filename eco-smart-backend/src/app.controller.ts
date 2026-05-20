import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}
  
  @Get()
  getHello() {
    return {
      message: 'EcoSmart API is running!',
      status: 'healthy',
      docs: 'Use the frontend application to interact with this API.'
    };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    const [userCount, complaintCount, totalTrucks, activeTrucks, dustbinCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.complaint.count(),
      this.prisma.truck.count(),
      this.prisma.truck.count({ where: { status: 'active' } }),
      this.prisma.dustbin.count(),
    ]);

    return {
      userCount,
      complaintCount,
      totalTrucks,
      activeTrucks,
      dustbinCount,
    };
  }
}