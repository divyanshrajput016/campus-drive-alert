import { Module } from '@nestjs/common';
import { PlacementDrivesService } from './placement-drives.service.js';
import { PlacementDrivesController } from './placement-drives.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PlacementDrivesController],
  providers: [PlacementDrivesService],
  exports: [PlacementDrivesService],
})
export class PlacementDrivesModule {}

