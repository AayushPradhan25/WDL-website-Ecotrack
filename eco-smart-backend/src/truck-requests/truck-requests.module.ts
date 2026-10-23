import { Module } from '@nestjs/common';
import { TruckRequestsController } from './truck-requests.controller';
import { TruckRequestsService } from './truck-requests.service';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [TruckRequestsController],
  providers: [TruckRequestsService, PrismaService, NotificationsService],
})
export class TruckRequestsModule {}
