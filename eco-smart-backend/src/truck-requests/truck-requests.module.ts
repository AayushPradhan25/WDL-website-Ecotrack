import { Module } from '@nestjs/common';
import { TruckRequestsController } from './truck-requests.controller';
import { TruckRequestsService } from './truck-requests.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TruckRequestsController],
  providers: [TruckRequestsService, PrismaService],
})
export class TruckRequestsModule {}
