import { Module } from '@nestjs/common';
import { PlacementDrivesService } from './placement-drives.service.js';
import { PlacementDrivesController } from './placement-drives.controller.js';

@Module({
  providers: [PlacementDrivesService],
  controllers: [PlacementDrivesController]
})
export class PlacementDrivesModule {}
