import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { SyncService } from './sync.service.js';
import { InsertMails } from './insertMails.js';

@Controller('sync')
export class SyncController {
    constructor(
        private readonly syncService:SyncService,
        private readonly insertMails:InsertMails
    ){}
    
    @Post("check-drives")
    sync() {
        return this.syncService.checkDrives();
    }

    @Post("insert")
    @HttpCode(201)
    get() {
        return this.insertMails.insertToDB();
    }
}
