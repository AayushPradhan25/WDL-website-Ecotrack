import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { TrucksModule } from './trucks/trucks.module';
import { DustbinsModule } from './dustbins/dustbins.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { RewardsModule } from './rewards/rewards.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TruckRequestsModule } from './truck-requests/truck-requests.module';
import { TruckSchedulesModule } from './truck-schedules/truck-schedules.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    UsersModule,
    TrucksModule,
    DustbinsModule,
    ComplaintsModule,
    RewardsModule,
    NotificationsModule,
    TruckRequestsModule,
    TruckSchedulesModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}