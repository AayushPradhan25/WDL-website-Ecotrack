import { Module } from '@nestjs/common';
import { TrucksController } from './trucks.controller';
import { TrucksService } from './trucks.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TrucksController],
  providers: [TrucksService, PrismaService],
  exports: [TrucksService],
})
export class TrucksModule {}
