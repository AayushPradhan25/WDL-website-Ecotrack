import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/listing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('listings')
@UseGuards(JwtAuthGuard)
export class ListingsController {
  constructor(private readonly service: ListingsService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Post()
  create(@Req() req, @Body() dto: CreateListingDto) { return this.service.create(req.user.userId, dto); }

  @Post(':id/purchase')
  purchase(@Param('id') id: string, @Req() req) { return this.service.purchase(+id, req.user.userId); }
}
