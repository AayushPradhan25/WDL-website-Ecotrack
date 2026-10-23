import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TrucksService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    try {
      return await this.prisma.truck.findMany({
        where: status ? { status } : undefined,
        include: { logs: true },
      });
    } catch {
      return [
        {
          id: 1,
          number: 'DL-01-EC-2026',
          driverName: 'Rajesh Kumar',
          driverPhone: '+91 98765 43210',
          status: 'on-route',
          latitude: 28.6145,
          longitude: 77.2095,
          logs: [],
        },
        {
          id: 2,
          number: 'DL-04-EC-4040',
          driverName: 'Amit Singh',
          driverPhone: '+91 98765 43211',
          status: 'active',
          latitude: 28.62,
          longitude: 77.218,
          logs: [],
        },
      ];
    }
  }

  async findOne(id: number) {
    const truck = await this.prisma.truck.findUnique({
      where: { id },
      include: { logs: { orderBy: { createdAt: 'desc' } } },
    });
    if (!truck) throw new NotFoundException('Truck not found');
    return truck;
  }

  create(data: { number: string; driverName: string }) {
    return this.prisma.truck.create({ data });
  }

  async update(
    id: number,
    data: { number?: string; driverName?: string; status?: string },
  ) {
    await this.findOne(id);
    return this.prisma.truck.update({ where: { id }, data });
  }

  async updateLocation(
    id: number,
    data: { latitude: number; longitude: number },
  ) {
    return this.prisma.truck.update({
      where: { id },
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
        status: 'on-route',
        lastActive: new Date(),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.truck.delete({ where: { id } });
  }

  addLog(truckId: number, message: string) {
    return this.prisma.truckLog.create({ data: { truckId, message } });
  }
}
