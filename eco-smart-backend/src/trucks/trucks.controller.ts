import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { CreateTruckDto, UpdateTruckDto, AddTruckLogDto } from './dto/truck.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('trucks')
@UseGuards(JwtAuthGuard)
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  // GET /trucks — Any logged-in user
  @Get()
  findAll() {
    return this.trucksService.findAll();
  }

  // GET /trucks/:id — Any logged-in user
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trucksService.findOne(+id);
  }

  // POST /trucks — Admin only: add a new truck
  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() createTruckDto: CreateTruckDto) {
    return this.trucksService.create(createTruckDto);
  }

  // PATCH /trucks/:id — Admin only: update truck info or status
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateTruckDto: UpdateTruckDto) {
    return this.trucksService.update(+id, updateTruckDto);
  }

  // DELETE /trucks/:id — Admin only: remove a truck
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.trucksService.remove(+id);
  }

  // POST /trucks/:id/log — Admin only: add activity log to a truck
  @Post(':id/log')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  addLog(@Param('id') id: string, @Body() addTruckLogDto: AddTruckLogDto) {
    return this.trucksService.addLog(+id, addTruckLogDto.message);
  }
}
