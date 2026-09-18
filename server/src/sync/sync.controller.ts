import { Controller, Post } from '@nestjs/common';
import { SyncService } from './sync.service.js';

@Controller('sync')
export class SyncController {
    constructor(private readonly syncService:SyncService){}
    
    @Post("check-drives")
    sync() {
        return this.syncService.checkDrives();
    }
}
