import { Module } from '@nestjs/common';
import { PlacementDrivesService } from './placement-drives.service.js';

@Module({
  providers: [PlacementDrivesService],
  exports:[PlacementDrivesService]
})
export class PlacementDrivesModule {}
