import { Module } from '@nestjs/common';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [RewardsController],
  providers: [RewardsService, PrismaService, NotificationsService],
  exports: [RewardsService],
})
export class RewardsModule {}
