import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('health')
  getHealth() {
    return this.adminService.getSystemHealth();
  }

  @Get('complaints/stats')
  getComplaintStats() {
    return this.adminService.getComplaintStats();
  }

  @Get('trucks/stats')
  getTruckStats() {
    return this.adminService.getTruckStats();
  }

  @Get('dustbins/stats')
  getDustbinStats() {
    return this.adminService.getDustbinStats();
  }

  @Get('users/stats')
  getUserStats() {
    return this.adminService.getUserStatistics();
  }

  @Get('activity/recent')
  getRecentActivity() {
    return this.adminService.getRecentActivity();
  }
}