import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateListingDto } from './dto/listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.listing.findMany({
      where: { status: 'AVAILABLE' },
      include: { seller: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.listing.findUnique({ where: { id }, include: { seller: true, buyer: true } });
  }

  async create(sellerId: number, dto: CreateListingDto) {
    return this.prisma.listing.create({ data: { ...dto, sellerId } });
  }

  async purchase(listingId: number, buyerId: number) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId }, include: { seller: true } });
    if (!listing || listing.status !== 'AVAILABLE') throw new Error('Listing not available');
    const buyer = await this.prisma.user.findUnique({ where: { id: buyerId } });
    if (!buyer) throw new Error('Buyer not found');
    if (buyer.ecoCoins < listing.price) throw new Error('Insufficient coins');
    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: buyerId }, data: { ecoCoins: buyer.ecoCoins - listing.price } });
      await tx.user.update({ where: { id: listing.sellerId }, data: { ecoCoins: { increment: listing.price } } });
      return tx.listing.update({ where: { id: listingId }, data: { status: 'SOLD', buyerId } });
    });
  }
}
