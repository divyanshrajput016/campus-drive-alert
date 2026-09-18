import { Module } from '@nestjs/common';
import { SyncService } from './sync.service.js';
import { SyncController } from './sync.controller.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  providers: [SyncService],
  controllers: [SyncController],
  imports: [NotificationsModule]
})
export class SyncModule {}
