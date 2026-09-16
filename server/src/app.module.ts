import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthService } from './auth/auth.service.js';
import { AuthController } from './auth/auth.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { SyncModule } from './sync/sync.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PlacementDrivesModule } from './placement-drives/placement-drives.module.js';

@Module({
  imports: [ AuthModule, NotificationsModule, SyncModule, PrismaModule, PlacementDrivesModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
