import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DustbinsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.dustbin.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number) {
    const bin = await this.prisma.dustbin.findUnique({ where: { id } });
    if (!bin) throw new NotFoundException('Dustbin not found');
    return bin;
  }

  create(data: { location: string; latitude?: number; longitude?: number }) {
    return this.prisma.dustbin.create({ data });
  }

  async update(id: number, data: { fillLevel?: number; status?: string; location?: string }) {
    await this.findOne(id);
    return this.prisma.dustbin.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.dustbin.delete({ where: { id } });
  }
}
