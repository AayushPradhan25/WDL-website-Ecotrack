import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DustbinsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.dustbin.findMany({ orderBy: { createdAt: 'desc' } });
    } catch {
      return [
        { id: 1, location: 'Metro Station Gate 2', fillLevel: 85, status: 'critical', latitude: 28.6139, longitude: 77.2090 },
        { id: 2, location: 'Central Market Square', fillLevel: 45, status: 'active', latitude: 28.6180, longitude: 77.2150 },
        { id: 3, location: 'Community Park North', fillLevel: 20, status: 'active', latitude: 28.6100, longitude: 77.2000 },
      ];
    }
  }

  async findOne(id: number) {
    const bin = await this.prisma.dustbin.findUnique({ where: { id } });
    if (!bin) throw new NotFoundException('Dustbin not found');
    return bin;
  }

  create(data: { location: string; latitude?: number; longitude?: number }) {
    return this.prisma.dustbin.create({ data });
  }

  async update(
    id: number,
    data: { fillLevel?: number; status?: string; location?: string },
  ) {
    await this.findOne(id);
    return this.prisma.dustbin.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.dustbin.delete({ where: { id } });
  }
}
