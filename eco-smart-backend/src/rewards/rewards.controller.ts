import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/reward.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('rewards')
@UseGuards(JwtAuthGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  // GET /rewards — Any logged-in user: see all rewards
  @Get()
  findAll() {
    return this.rewardsService.findAll();
  }

  // GET /rewards/mine — Logged-in user: see rewards they've claimed
  @Get('mine')
  getMyRewards(@Request() req) {
    return this.rewardsService.getUserRewards(req.user.userId);
  }

  // POST /rewards — Admin only: create a new reward
  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardsService.create(createRewardDto);
  }

  // POST /rewards/:id/redeem — Logged-in user: redeem a reward using eco coins
  @Post(':id/redeem')
  redeem(@Request() req, @Param('id') id: string) {
    return this.rewardsService.redeem(req.user.userId, +id);
  }
}
