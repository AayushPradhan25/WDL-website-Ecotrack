import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';

@Injectable()
export class TruckSchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScheduleDto) {
    return this.prisma.schedule.create({
      data: { ...dto, truckId: dto.truckId || null },
      include: { truck: true },
    });
  }

  async findAll() {
    return this.prisma.schedule.findMany({ include: { truck: true }, orderBy: [{ dayOfWeek: 'asc' }, { time: 'asc' }] });
  }

  async findOne(id: number) {
    return this.prisma.schedule.findUnique({ where: { id }, include: { truck: true } });
  }

  async update(id: number, dto: UpdateScheduleDto) {
    return this.prisma.schedule.update({ where: { id }, data: dto, include: { truck: true } });
  }

  async remove(id: number) {
    return this.prisma.schedule.delete({ where: { id } });
  }
}
