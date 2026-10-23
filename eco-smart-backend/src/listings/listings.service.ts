import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateListingDto } from './dto/listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    query: { page?: number; limit?: number; category?: string } = {},
  ) {
    const { page = 1, limit = 20, category } = query;
    const skip = (page - 1) * limit;
    return this.prisma.listing.findMany({
      where: {
        status: 'AVAILABLE',
        ...(category ? { category } : {}),
      },
      include: { seller: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  // Admin: get all listings regardless of status
  async findAllAdmin() {
    return this.prisma.listing.findMany({
      include: {
        seller: { select: { id: true, name: true, email: true } },
        buyer: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { seller: true, buyer: true },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async create(sellerId: number, dto: CreateListingDto) {
    return this.prisma.listing.create({ data: { ...dto, sellerId } });
  }

  async purchase(listingId: number, buyerId: number) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { seller: true },
    });
    if (!listing || listing.status !== 'AVAILABLE')
      throw new NotFoundException('Listing not available');
    const buyer = await this.prisma.user.findUnique({ where: { id: buyerId } });
    if (!buyer) throw new NotFoundException('Buyer not found');
    if (buyer.ecoCoins < listing.price) throw new Error('Insufficient coins');
    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: buyerId },
        data: { ecoCoins: buyer.ecoCoins - listing.price },
      });
      await tx.user.update({
        where: { id: listing.sellerId },
        data: { ecoCoins: { increment: listing.price } },
      });
      return tx.listing.update({
        where: { id: listingId },
        data: { status: 'SOLD', buyerId },
      });
    });
  }

  // Admin: delete a listing
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.listing.delete({ where: { id } });
  }

  // Admin: update listing status
  async updateStatus(id: number, status: string) {
    await this.findOne(id);
    return this.prisma.listing.update({ where: { id }, data: { status } });
  }
}
