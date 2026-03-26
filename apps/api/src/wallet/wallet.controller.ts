import { Controller, Get, Post, Body, UseGuards, Req, Headers, RawBodyRequest } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { FlutterwaveService } from './flutterwave.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { Request } from 'express';

@Controller('wallet')
export class WalletController {
    constructor(
        private walletService: WalletService,
        private flutterwaveService: FlutterwaveService,
    ) {}

    @Get('balance')
    @UseGuards(JwtAuthGuard)
    getBalance(@CurrentUser('id') userId: string) {
        return this.walletService.getBalance(userId);
    }

    @Post('fund/initialize')
    @UseGuards(JwtAuthGuard)
    initializeFunding(
        @CurrentUser('id') userId: string,
        @Body() body: { amount: number },
    ) {
        return this.walletService.initializeFunding(userId, body.amount);
    }

    @Post('fund/verify')
    @UseGuards(JwtAuthGuard)
    verifyFunding(
        @CurrentUser('id') userId: string,
        @Body() body: { reference: string; transactionId?: string },
    ) {
        return this.walletService.verifyFunding(body.reference, userId, body.transactionId);
    }

    @Post('webhook/flutterwave')
    async handleFlutterwaveWebhook(
        @Headers('verif-hash') signature: string,
        @Body() body: any,
    ) {
        if (!this.flutterwaveService.verifyWebhookSignature(signature)) {
            return { status: 'invalid signature' };
        }

        const event = body.event;
        const data = body.data;
        await this.walletService.handleWebhook(event, data);

        return { status: 'ok' };
    }
}
