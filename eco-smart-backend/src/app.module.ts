import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
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
import { ListingsModule } from './listings/listings.module';
import { UploadModule } from './upload/upload.module';
import { TrackingGatewayModule } from './tracking/tracking.module';

@Module({
  imports: [
    // Load .env variables globally before all other modules
    ConfigModule.forRoot({ isGlobal: true }),
    // Global rate limiting: 100 requests per 60 seconds per IP
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
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
    ListingsModule,
    UploadModule,
    TrackingGatewayModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    // Apply rate limiting globally to every route
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
