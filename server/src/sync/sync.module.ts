import { Module } from '@nestjs/common';
import { SyncService } from './sync.service.js';
import { SyncController } from './sync.controller.js';

@Module({
  providers: [SyncService],
  controllers: [SyncController]
})
export class SyncModule {}
