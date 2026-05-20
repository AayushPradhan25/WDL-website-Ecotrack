import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalComplaints,
      totalDustbins,
      totalTrucks,
      activeUsers,
      pendingComplaints,
      activeDustbins,
      activeTrucks,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.complaint.count(),
      this.prisma.dustbin.count(),
      this.prisma.truck.count(),
      this.prisma.user.count({ where: { status: 'active' } }),
      this.prisma.complaint.count({ where: { status: 'pending' } }),
      this.prisma.dustbin.count({ where: { status: 'active' } }),
      this.prisma.truck.count({ where: { status: { not: 'inactive' } } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalComplaints,
      pendingComplaints,
      totalDustbins,
      activeDustbins,
      totalTrucks,
      activeTrucks,
      timestamp: new Date(),
    };
  }

  async getSystemHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  async getComplaintStats() {
    const stats = await this.prisma.complaint.groupBy({
      by: ['status'],
      _count: true,
    });

    return {
      complaints: stats.map((item) => ({
        status: item.status,
        count: item._count,
      })),
    };
  }

  async getTruckStats() {
    const totalDistance = await this.prisma.truckLog.count();
    const activeTrucks = await this.prisma.truck.count({
      where: { status: { not: 'inactive' } },
    });

    return {
      totalTrucks: await this.prisma.truck.count(),
      activeTrucks,
      totalLogs: totalDistance,
    };
  }

  async getDustbinStats() {
    const dustbins = await this.prisma.dustbin.findMany({
      select: {
        status: true,
        fillLevel: true,
      },
    });

    const fullBins = dustbins.filter((d) => d.fillLevel >= 80).length;
    const emptyBins = dustbins.filter((d) => d.fillLevel < 20).length;

    return {
      total: dustbins.length,
      fullBins,
      emptyBins,
      avgFillLevel: dustbins.length
        ? Math.round(
            dustbins.reduce((sum, d) => sum + d.fillLevel, 0) / dustbins.length,
          )
        : 0,
    };
  }

  async getRecentActivity(limit = 10) {
    const recentComplaints = await this.prisma.complaint.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    return {
      recentComplaints,
      timestamp: new Date(),
    };
  }

  async getUserStatistics() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        role: true,
        ecoCoins: true,
      },
    });

    const admins = users.filter((u) => u.role === 'ADMIN').length;
    const regularUsers = users.filter((u) => u.role === 'USER').length;
    const totalCoins = users.reduce((sum, u) => sum + u.ecoCoins, 0);
    const avgCoins = regularUsers > 0 ? Math.round(totalCoins / regularUsers) : 0;

    return {
      totalAdmins: admins,
      totalRegularUsers: regularUsers,
      totalCoinsInCirculation: totalCoins,
      avgCoinsPerUser: avgCoins,
    };
  }
}
