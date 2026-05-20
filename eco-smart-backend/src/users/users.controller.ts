import { Controller, Get, Patch, Param, UseGuards, Req, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users — Admin only: see all users
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(user => {
      const { password, ...result } = user as any;
      return result;
    });
  }

  // GET /users/leaderboard — Any logged-in user
  @Get('leaderboard')
  getLeaderboard() {
    return this.usersService.getLeaderboard();
  }

  // GET /users/me — Get the currently logged in user's profile
  @Get('me')
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.userId);
  }

  // GET /users/:id — Admin only: see one user
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // PATCH /users/:id/toggle-status — Admin only: ban/unban user
  @Patch(':id/toggle-status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  toggleStatus(@Param('id') id: string) {
    return this.usersService.toggleStatus(+id);
  }

  // PATCH /users/:id/add-coins/:coins — Admin only: give eco coins to a user
  @Patch(':id/add-coins/:coins')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  addCoins(@Param('id') id: string, @Param('coins') coins: string) {
    return this.usersService.addCoins(+id, +coins);
  }
  // PATCH /users/profile — Any logged-in user: update their own profile
  @Patch('profile')
  updateProfile(@Req() req, @Body() data: { name?: string; email?: string }) {
    return this.usersService.update(req.user.userId, data);
  }
}
