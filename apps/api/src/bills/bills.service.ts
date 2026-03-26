import { Injectable, BadRequestException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { transactions, wallets } from '../database/schema';
import { dataBundles, cableBouquets, discoList } from './bills.data';
import { VtpassService } from './vtpass.service';

@Injectable()
export class BillsService {
    constructor(
        private db: DatabaseService,
        private vtpass: VtpassService,
    ) {}

    // ─── Reference Data ───

    getDataBundles(network: string) {
        return dataBundles[network] ?? [];
    }

    getCableBouquets(provider: string) {
        return cableBouquets[provider] ?? [];
    }

    getDiscos() {
        return discoList;
    }

    // ─── Verification ───

    async verifyMeter(discoId: string, meterType: string, meterNumber: string) {
        if (this.vtpass.isConfigured) {
            const serviceId = VtpassService.getElectricityServiceId(discoId);
            return this.vtpass.verifyMeter({
                serviceID: serviceId,
                billersCode: meterNumber,
                type: meterType,
            });
        }

        // Simulated verification fallback
        const disco = discoList.find((d) => d.id === discoId);
        return {
            customerName: 'John Doe',
            meterNumber,
            disco: disco?.name || discoId,
        };
    }

    async verifySmartcard(provider: string, smartcardNumber: string) {
        if (this.vtpass.isConfigured) {
            return this.vtpass.verifySmartcard({
                serviceID: provider,
                billersCode: smartcardNumber,
            });
        }

        // Simulated verification fallback
        return {
            customerName: 'Jane Smith',
            smartcardNumber,
            provider,
        };
    }

    // ─── Bill Payments ───

    async buyAirtime(userId: string, network: string, phone: string, amount: number) {
        if (amount < 50) {
            throw new BadRequestException('Minimum airtime amount is ₦50');
        }

        await this.debitWallet(userId, amount);

        const reference = `PZ-AIR-${Date.now()}-${this.randomSuffix()}`;
        const txnId = uuidv4();

        let providerResponse: any = null;
        let status: 'successful' | 'failed' = 'successful';

        if (this.vtpass.isConfigured) {
            try {
                const serviceId = VtpassService.getAirtimeServiceId(network);
                providerResponse = await this.vtpass.buyAirtime({
                    phone,
                    amount,
                    serviceID: serviceId,
                });
            } catch (error: any) {
                // Refund wallet on failure
                await this.creditWallet(userId, amount);
                status = 'failed';
                throw new BadRequestException(error.message || 'Airtime purchase failed via provider');
            }
        }

        await this.db.db.insert(transactions).values({
            id: txnId,
            userId,
            type: 'airtime',
            status,
            amount,
            reference,
            provider: network,
            metadata: JSON.stringify({
                phone,
                network,
                ...(providerResponse && { vtpassRequestId: providerResponse.requestId }),
            }),
        });

        return {
            message: 'Airtime purchase successful',
            transaction: {
                id: txnId,
                reference,
                amount,
                phone,
                network,
                status: 'success',
                date: new Date().toISOString(),
            },
        };
    }

    async buyData(userId: string, network: string, phone: string, bundleId: string) {
        const bundles = dataBundles[network];
        if (!bundles) {
            throw new BadRequestException('Invalid network');
        }

        const bundle = bundles.find((b: any) => b.id === bundleId);
        if (!bundle) {
            throw new BadRequestException('Invalid bundle');
        }

        await this.debitWallet(userId, bundle.amount);

        const reference = `PZ-DAT-${Date.now()}-${this.randomSuffix()}`;
        const txnId = uuidv4();

        let providerResponse: any = null;

        if (this.vtpass.isConfigured) {
            try {
                const serviceId = VtpassService.getDataServiceId(network);
                providerResponse = await this.vtpass.buyData({
                    phone,
                    serviceID: serviceId,
                    billersCode: phone,
                    variationCode: bundleId,
                    amount: bundle.amount,
                });
            } catch (error: any) {
                await this.creditWallet(userId, bundle.amount);
                throw new BadRequestException(error.message || 'Data purchase failed via provider');
            }
        }

        await this.db.db.insert(transactions).values({
            id: txnId,
            userId,
            type: 'data',
            status: 'successful',
            amount: bundle.amount,
            reference,
            provider: network,
            metadata: JSON.stringify({
                phone,
                network,
                bundleName: bundle.name,
                bundleId,
                ...(providerResponse && { vtpassRequestId: providerResponse.requestId }),
            }),
        });

        return {
            message: 'Data purchase successful',
            transaction: {
                id: txnId,
                reference,
                amount: bundle.amount,
                phone,
                network,
                bundleName: bundle.name,
                status: 'success',
                date: new Date().toISOString(),
            },
        };
    }

    async payElectricity(
        userId: string,
        discoId: string,
        meterType: string,
        meterNumber: string,
        amount: number,
        phone?: string,
    ) {
        if (amount < 500) {
            throw new BadRequestException('Minimum electricity payment is ₦500');
        }

        await this.debitWallet(userId, amount);

        const disco = discoList.find((d) => d.id === discoId);
        const reference = `PZ-ELC-${Date.now()}-${this.randomSuffix()}`;
        const txnId = uuidv4();

        let providerResponse: any = null;
        let token: string | null = null;

        if (this.vtpass.isConfigured) {
            try {
                const serviceId = VtpassService.getElectricityServiceId(discoId);
                providerResponse = await this.vtpass.payElectricity({
                    serviceID: serviceId,
                    billersCode: meterNumber,
                    variationCode: meterType,
                    amount,
                    phone: phone || '08000000000',
                });
                token = providerResponse.token;
            } catch (error: any) {
                await this.creditWallet(userId, amount);
                throw new BadRequestException(error.message || 'Electricity payment failed via provider');
            }
        }

        await this.db.db.insert(transactions).values({
            id: txnId,
            userId,
            type: 'electricity',
            status: 'successful',
            amount,
            reference,
            provider: discoId,
            metadata: JSON.stringify({
                meterNumber,
                meterType,
                disco: disco?.name || discoId,
                customerName: 'John Doe',
                ...(token && { token }),
                ...(providerResponse && { vtpassRequestId: providerResponse.requestId }),
            }),
        });

        return {
            message: 'Electricity bill payment successful',
            transaction: {
                id: txnId,
                reference,
                amount,
                meterNumber,
                disco: disco?.name || discoId,
                customerName: 'John Doe',
                status: 'success',
                date: new Date().toISOString(),
                ...(token && { token }),
            },
        };
    }

    async subscribeCableTv(
        userId: string,
        provider: string,
        smartcardNumber: string,
        bouquetId: string,
        phone?: string,
    ) {
        const bouquets = cableBouquets[provider];
        if (!bouquets) {
            throw new BadRequestException('Invalid provider');
        }

        const bouquet = bouquets.find((b: any) => b.id === bouquetId);
        if (!bouquet) {
            throw new BadRequestException('Invalid bouquet');
        }

        await this.debitWallet(userId, bouquet.amount);

        const reference = `PZ-CAB-${Date.now()}-${this.randomSuffix()}`;
        const txnId = uuidv4();

        let providerResponse: any = null;

        if (this.vtpass.isConfigured) {
            try {
                providerResponse = await this.vtpass.subscribeCableTv({
                    serviceID: provider,
                    billersCode: smartcardNumber,
                    variationCode: bouquetId,
                    amount: bouquet.amount,
                    phone: phone || '08000000000',
                });
            } catch (error: any) {
                await this.creditWallet(userId, bouquet.amount);
                throw new BadRequestException(error.message || 'Cable TV subscription failed via provider');
            }
        }

        await this.db.db.insert(transactions).values({
            id: txnId,
            userId,
            type: 'cable_tv',
            status: 'successful',
            amount: bouquet.amount,
            reference,
            provider,
            metadata: JSON.stringify({
                smartcardNumber,
                bouquetName: bouquet.name,
                bouquetId,
                customerName: 'Jane Smith',
                ...(providerResponse && { vtpassRequestId: providerResponse.requestId }),
            }),
        });

        return {
            message: 'Cable TV subscription successful',
            transaction: {
                id: txnId,
                reference,
                amount: bouquet.amount,
                smartcardNumber,
                provider,
                bouquetName: bouquet.name,
                customerName: 'Jane Smith',
                status: 'success',
                date: new Date().toISOString(),
            },
        };
    }

    // ─── Helpers ───

    private async debitWallet(userId: string, amount: number) {
        const wallet = await this.db.db
            .select()
            .from(wallets)
            .where(eq(wallets.userId, userId))
            .limit(1);

        const w = wallet[0];
        if (!w) {
            throw new BadRequestException('Wallet not found');
        }

        if (w.balance < amount) {
            throw new BadRequestException('Insufficient wallet balance');
        }

        await this.db.db
            .update(wallets)
            .set({
                balance: sql`${wallets.balance} - ${amount}`,
                updatedAt: new Date(),
            })
            .where(eq(wallets.userId, userId));
    }

    private async creditWallet(userId: string, amount: number) {
        await this.db.db
            .update(wallets)
            .set({
                balance: sql`${wallets.balance} + ${amount}`,
                updatedAt: new Date(),
            })
            .where(eq(wallets.userId, userId));
    }

    private randomSuffix(): string {
        return Math.random().toString(36).substring(2, 6).toUpperCase();
    }
}
