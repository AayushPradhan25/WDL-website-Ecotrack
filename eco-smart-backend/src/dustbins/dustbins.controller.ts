import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { DustbinsService } from './dustbins.service';
import { CreateDustbinDto, UpdateDustbinDto } from './dto/dustbin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('dustbins')
@UseGuards(JwtAuthGuard)
export class DustbinsController {
  constructor(private readonly dustbinsService: DustbinsService) {}

  // GET /dustbins — Any logged-in user
  @Get()
  findAll() {
    return this.dustbinsService.findAll();
  }

  // GET /dustbins/:id — Any logged-in user
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dustbinsService.findOne(+id);
  }

  // POST /dustbins — Admin only: add a new dustbin
  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() createDustbinDto: CreateDustbinDto) {
    return this.dustbinsService.create(createDustbinDto);
  }

  // PATCH /dustbins/:id — Admin only: update fill level or status
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateDustbinDto: UpdateDustbinDto) {
    return this.dustbinsService.update(+id, updateDustbinDto);
  }

  // DELETE /dustbins/:id — Admin only: remove a dustbin
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.dustbinsService.remove(+id);
  }
}
