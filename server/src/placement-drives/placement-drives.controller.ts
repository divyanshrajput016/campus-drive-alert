import { Controller, Get } from '@nestjs/common';
import { PlacementDrivesService } from './placement-drives.service.js';

@Controller('placement-drives')
export class PlacementDrivesController {
  constructor(private readonly placementDrivesService: PlacementDrivesService) {}

  @Get()
  async getDrives() {
    return this.placementDrivesService.getDrivesFromDB();
  }
}
