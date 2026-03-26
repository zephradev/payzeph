import { Module } from '@nestjs/common';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { VtpassService } from './vtpass.service';

@Module({
    controllers: [BillsController],
    providers: [BillsService, VtpassService],
})
export class BillsModule {}
