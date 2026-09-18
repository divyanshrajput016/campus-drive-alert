import { Module } from '@nestjs/common';
import { SyncService } from './sync.service.js';
import { SyncController } from './sync.controller.js';
import { InsertMails } from './insertMails.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PlacementDrivesModule } from '../placement-drives/placement-drives.module.js';

@Module({
  providers: [SyncService, InsertMails],
  controllers: [SyncController],
  imports: [NotificationsModule , PrismaModule, PlacementDrivesModule]
})
export class SyncModule {}
