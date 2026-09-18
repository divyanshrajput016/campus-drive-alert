import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class SyncService {
    constructor(private readonly notificationsService:NotificationsService) {}
    
    async checkDrives() {
        const newDrive = true;

        if(newDrive) {
            this.notificationsService.sendEmail("abc@example.com","Bajaj 12LPA");
        }
    }
}
