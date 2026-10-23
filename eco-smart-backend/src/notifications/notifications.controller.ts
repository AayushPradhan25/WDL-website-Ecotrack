import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /notifications — Logged-in user: see their notifications
  @Get()
  getMyNotifications(@Request() req) {
    return this.notificationsService.getForUser(req.user.userId);
  }

  // PATCH /notifications/read-all — Mark all as read (must be before :id route)
  @Patch('read-all')
  markAllRead(@Request() req) {
    return this.notificationsService.markAllRead(req.user.userId);
  }

  // PATCH /notifications/:id/read — Mark one notification as read
  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(+id);
  }

  // DELETE /notifications — Clear all notifications for the logged-in user
  @Delete()
  clearAll(@Request() req) {
    return this.notificationsService.deleteAll(req.user.userId);
  }

  // DELETE /notifications/:id — Delete a single notification
  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.notificationsService.deleteOne(+id);
  }
}
