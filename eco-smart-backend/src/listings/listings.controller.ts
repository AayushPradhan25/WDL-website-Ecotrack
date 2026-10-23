import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/listing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('listings')
@UseGuards(JwtAuthGuard)
export class ListingsController {
  constructor(private readonly service: ListingsService) {}

  // GET /listings?page=1&limit=20&category=plastic — all users
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    return this.service.findAll({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      category,
    });
  }

  // GET /listings/admin — Admin only: see all listings including SOLD
  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAllAdmin() {
    return this.service.findAllAdmin();
  }

  // GET /listings/:id — any logged-in user
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  // POST /listings — logged-in user: create a listing
  @Post()
  create(@Req() req, @Body() dto: CreateListingDto) {
    return this.service.create(req.user.userId, dto);
  }

  // POST /listings/:id/purchase — logged-in user: buy a listing with eco-coins
  @Post(':id/purchase')
  purchase(@Param('id') id: string, @Req() req) {
    return this.service.purchase(+id, req.user.userId);
  }

  // PATCH /listings/:id/status — Admin only: change listing status
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.service.updateStatus(+id, body.status);
  }

  // DELETE /listings/:id — Admin only: remove a listing
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
