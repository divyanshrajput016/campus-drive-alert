import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PlacementDrivesService } from '../placement-drives/placement-drives.service.js';

type Data = {
    externalId : string,
    companyName : string,
    jobLocation : string,
    companyApplyUrl : string,

    minCgpa : number,
    maxBacklog : number,

    startDate : Date,
    registrationDeadline : Date,
    isOpenForApply : boolean,

    sourceCreatedAt : Date,
}

@Injectable()
export class InsertMails {
    constructor(
        private readonly prisma: PrismaService,
        private readonly placementDrives:PlacementDrivesService
        ) {}

    async insertToDB() {

        const placementDrives : any = await this.placementDrives.getPlacementDrives();
        const placementDrivesArray = placementDrives.content;

        for(const placementdrive of placementDrivesArray) {


                await this.prisma.placementDrive.upsert({
                    where: {
                        externalId: placementdrive.driveId,
                    },

                    create: {
                        externalId: placementdrive.driveId,
                        companyName: placementdrive.driveName,
                        jobLocation: placementdrive.jobLocation,
                        companyApplyUrl: placementdrive.companyApplyUrl,

                        minCgpa: placementdrive.minCgpa,
                        maxBacklog: placementdrive.maxBacklog,

                        startDate: new Date(placementdrive.startDate),
                        registrationDeadline: new Date(placementdrive.regDeadline),
                        sourceCreatedAt: new Date(placementdrive.createdAt),
                    },

                    update: {}, // don't change anything if it already exists
                });
        }

        return {
        message: 'Placement drives inserted successfully',
        count: placementDrivesArray.length,
    };

        
    }
}