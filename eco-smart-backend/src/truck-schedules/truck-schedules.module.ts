import { Module } from '@nestjs/common';
import { TruckSchedulesController } from './truck-schedules.controller';
import { TruckSchedulesService } from './truck-schedules.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TruckSchedulesController],
  providers: [TruckSchedulesService, PrismaService],
})
export class TruckSchedulesModule {}
