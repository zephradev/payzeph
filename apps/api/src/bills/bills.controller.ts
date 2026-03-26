import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { BillsService } from './bills.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('bills')
@UseGuards(JwtAuthGuard)
export class BillsController {
    constructor(private billsService: BillsService) {}

    // ─── Reference Data ───

    @Get('data/bundles')
    getDataBundles(@Query('network') network: string) {
        return this.billsService.getDataBundles(network);
    }

    @Get('cable-tv/bouquets')
    getCableBouquets(@Query('provider') provider: string) {
        return this.billsService.getCableBouquets(provider);
    }

    @Get('discos')
    getDiscos() {
        return this.billsService.getDiscos();
    }

    // ─── Verification ───

    @Post('electricity/verify-meter')
    verifyMeter(
        @Body() body: { discoId: string; meterType: string; meterNumber: string },
    ) {
        return this.billsService.verifyMeter(body.discoId, body.meterType, body.meterNumber);
    }

    @Post('cable-tv/verify-smartcard')
    verifySmartcard(
        @Body() body: { provider: string; smartcardNumber: string },
    ) {
        return this.billsService.verifySmartcard(body.provider, body.smartcardNumber);
    }

    // ─── Bill Payments ───

    @Post('airtime')
    buyAirtime(
        @CurrentUser('id') userId: string,
        @Body() body: { network: string; phone: string; amount: number },
    ) {
        return this.billsService.buyAirtime(userId, body.network, body.phone, body.amount);
    }

    @Post('data')
    buyData(
        @CurrentUser('id') userId: string,
        @Body() body: { network: string; phone: string; bundleId: string },
    ) {
        return this.billsService.buyData(userId, body.network, body.phone, body.bundleId);
    }

    @Post('electricity')
    payElectricity(
        @CurrentUser('id') userId: string,
        @Body()
        body: {
            discoId: string;
            meterType: string;
            meterNumber: string;
            amount: number;
            phone?: string;
        },
    ) {
        return this.billsService.payElectricity(
            userId,
            body.discoId,
            body.meterType,
            body.meterNumber,
            body.amount,
            body.phone,
        );
    }

    @Post('cable-tv')
    subscribeCableTv(
        @CurrentUser('id') userId: string,
        @Body()
        body: {
            provider: string;
            smartcardNumber: string;
            bouquetId: string;
            phone?: string;
        },
    ) {
        return this.billsService.subscribeCableTv(
            userId,
            body.provider,
            body.smartcardNumber,
            body.bouquetId,
            body.phone,
        );
    }
}
