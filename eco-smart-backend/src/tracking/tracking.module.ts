import { Module } from '@nestjs/common';
import { TrackingGateway } from './tracking.gateway';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [TrackingGateway, PrismaService],
})
export class TrackingGatewayModule {}
