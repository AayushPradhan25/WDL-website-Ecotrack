import { Module } from '@nestjs/common';
import { DustbinsController } from './dustbins.controller';
import { DustbinsService } from './dustbins.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DustbinsController],
  providers: [DustbinsService, PrismaService],
  exports: [DustbinsService],
})
export class DustbinsModule {}
