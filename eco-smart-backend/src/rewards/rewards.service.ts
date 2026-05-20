import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.reward.findMany({ orderBy: { coinsNeeded: 'asc' } });
  }

  create(data: { name: string; description: string; coinsNeeded: number; imageUrl?: string }) {
    return this.prisma.reward.create({ data });
  }

  async redeem(userId: number, rewardId: number) {
    const [user, reward] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.reward.findUnique({ where: { id: rewardId } }),
    ]);
    if (!user || !reward) throw new NotFoundException('User or reward not found');
    if (user.ecoCoins < reward.coinsNeeded)
      throw new BadRequestException('Insufficient Eco Coins');

    return this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { ecoCoins: { decrement: reward.coinsNeeded } },
      }),
      this.prisma.userReward.create({ data: { userId, rewardId } }),
    ]);
  }

  getUserRewards(userId: number) {
    return this.prisma.userReward.findMany({
      where: { userId },
      include: { reward: true },
    });
  }
}
