import { Module } from '@nestjs/common';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsService } from './complaints.service';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [ComplaintsController],
  providers: [ComplaintsService, PrismaService, NotificationsService],
  exports: [ComplaintsService],
})
export class ComplaintsModule {}
