import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { FlutterwaveService } from './flutterwave.service';

@Module({
    controllers: [WalletController],
    providers: [WalletService, FlutterwaveService],
    exports: [WalletService, FlutterwaveService],
})
export class WalletModule {}
