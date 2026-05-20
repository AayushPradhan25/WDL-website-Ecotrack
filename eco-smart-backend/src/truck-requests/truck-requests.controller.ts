import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TruckRequestsService } from './truck-requests.service';
import { CreateTruckRequestDto, UpdateTruckRequestDto } from './dto/truck-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('truck-requests')
@UseGuards(JwtAuthGuard)
export class TruckRequestsController {
  constructor(private readonly service: TruckRequestsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() { return this.service.findAll(); }

  @Get('my')
  findByUser(@Req() req) { return this.service.findByUser(req.user.userId); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Post()
  create(@Req() req, @Body() dto: CreateTruckRequestDto) { return this.service.create(req.user.userId, dto); }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateTruckRequestDto) { return this.service.update(+id, dto); }
}
