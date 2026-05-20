import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTruckRequestDto, UpdateTruckRequestDto } from './dto/truck-request.dto';

@Injectable()
export class TruckRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateTruckRequestDto) {
    return this.prisma.truckRequest.create({
      data: { ...dto, userId, preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : undefined },
      include: { user: true },
    });
  }

  async findAll() {
    return this.prisma.truckRequest.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
  }

  async findByUser(userId: number) {
    return this.prisma.truckRequest.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number) {
    return this.prisma.truckRequest.findUnique({ where: { id }, include: { user: true } });
  }

  async update(id: number, dto: UpdateTruckRequestDto) {
    return this.prisma.truckRequest.update({ where: { id }, data: dto, include: { user: true } });
  }
}
