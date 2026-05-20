import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto, UpdateComplaintStatusDto } from './dto/complaint.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('complaints')
@UseGuards(JwtAuthGuard)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  // GET /complaints — Admin only: see all complaints
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.complaintsService.findAll();
  }

  // GET /complaints/my — Logged-in user: see their own complaints
  @Get('my')
  findMine(@Request() req) {
    return this.complaintsService.findByUser(req.user.userId);
  }

  // GET /complaints/:id — Get one complaint by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintsService.findOne(+id);
  }

  // POST /complaints — Logged-in user: raise a new complaint
  @Post()
  create(@Request() req, @Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintsService.create(req.user.userId, createComplaintDto);
  }

  // PATCH /complaints/:id/status — Admin only: update complaint status
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateComplaintStatusDto) {
    return this.complaintsService.updateStatus(+id, updateStatusDto.status);
  }
}
