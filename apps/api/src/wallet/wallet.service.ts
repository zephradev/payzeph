import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { wallets, transactions, users } from '../database/schema';
import { FlutterwaveService } from './flutterwave.service';

@Injectable()
export class WalletService {
    private readonly useSimulation: boolean;

    constructor(
        private db: DatabaseService,
        private flutterwave: FlutterwaveService,
        private config: ConfigService,
    ) {
        const flwKey = this.config.get<string>('FLW_SECRET_KEY') || '';
        this.useSimulation = !flwKey || flwKey.includes('your_secret_key_here');
    }

    async getBalance(userId: string) {
        const result = await this.db.db
            .select()
            .from(wallets)
            .where(eq(wallets.userId, userId))
            .limit(1);

        const wallet = result[0];
        if (!wallet) {
            return { balance: 0 };
        }

        return { balance: wallet.balance };
    }

    async initializeFunding(userId: string, amount: number) {
        if (amount < 100) {
            throw new BadRequestException('Minimum funding amount is ₦100');
        }

        // Get user email
        const userResult = await this.db.db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        const user = userResult[0];
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const wallet = await this.db.db
            .select()
            .from(wallets)
            .where(eq(wallets.userId, userId))
            .limit(1);

        if (wallet.length === 0) {
            throw new BadRequestException('Wallet not found');
        }

        const reference = `PZ-WLT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const txnId = uuidv4();

        // Create pending transaction
        await this.db.db.insert(transactions).values({
            id: txnId,
            userId,
            type: 'wallet_funding',
            status: 'pending',
            amount,
            reference,
            provider: this.useSimulation ? 'simulated' : 'flutterwave',
            metadata: JSON.stringify({ method: 'card' }),
        });

        const appUrl = this.config.get('NEXT_PUBLIC_APP_URL') || 'http://localhost:3001';
        const callbackUrl = `${appUrl}/dashboard/wallet`;

        if (this.useSimulation) {
            // Simulated payment — redirect to mock checkout
            const checkoutUrl = `${appUrl}/payment/checkout?amount=${amount}&reference=${reference}&callback=${encodeURIComponent(callbackUrl)}&email=${encodeURIComponent(user.email)}`;

            return {
                message: 'Payment initialized (test mode)',
                authorizationUrl: checkoutUrl,
                reference,
                transactionId: txnId,
            };
        }

        // Real Flutterwave flow
        const flwData = await this.flutterwave.initializeTransaction({
            email: user.email,
            amount,
            txRef: reference,
            redirectUrl: `${callbackUrl}?reference=${reference}`,
            customerName: `${user.firstName} ${user.lastName}`,
            meta: {
                userId,
                transactionId: txnId,
                type: 'wallet_funding',
            },
        });

        return {
            message: 'Payment initialized',
            authorizationUrl: flwData.link,
            reference,
            transactionId: txnId,
        };
    }

    async verifyFunding(reference: string, userId: string, transactionId?: string) {
        // Find the pending transaction
        const txnResult = await this.db.db
            .select()
            .from(transactions)
            .where(eq(transactions.reference, reference))
            .limit(1);

        const txn = txnResult[0];
        if (!txn) {
            throw new BadRequestException('Transaction not found');
        }

        if (txn.userId !== userId) {
            throw new BadRequestException('Transaction does not belong to this user');
        }

        if (txn.status === 'successful') {
            return {
                message: 'Transaction already verified',
                transaction: {
                    id: txn.id,
                    amount: txn.amount,
                    status: 'success',
                    reference: txn.reference,
                },
            };
        }

        // Simulated payment — auto-verify
        if (txn.provider === 'simulated') {
            // Credit wallet
            await this.db.db
                .update(wallets)
                .set({
                    balance: sql`${wallets.balance} + ${txn.amount}`,
                    updatedAt: new Date(),
                })
                .where(eq(wallets.userId, userId));

            // Update transaction status
            await this.db.db
                .update(transactions)
                .set({ status: 'successful' })
                .where(eq(transactions.id, txn.id));

            return {
                message: 'Wallet funded successfully',
                transaction: {
                    id: txn.id,
                    amount: txn.amount,
                    status: 'success',
                    reference,
                    date: new Date().toISOString(),
                },
            };
        }

        // Real Flutterwave verification
        if (!transactionId) {
            throw new BadRequestException('Transaction ID is required for verification');
        }

        const flwData = await this.flutterwave.verifyTransaction(transactionId);

        if (flwData.status === 'successful' && flwData.tx_ref === reference) {
            const amount = flwData.amount;

            // Credit wallet
            await this.db.db
                .update(wallets)
                .set({
                    balance: sql`${wallets.balance} + ${amount}`,
                    updatedAt: new Date(),
                })
                .where(eq(wallets.userId, userId));

            // Update transaction status
            await this.db.db
                .update(transactions)
                .set({ status: 'successful' })
                .where(eq(transactions.id, txn.id));

            return {
                message: 'Wallet funded successfully',
                transaction: {
                    id: txn.id,
                    amount,
                    status: 'success',
                    reference,
                    date: new Date().toISOString(),
                },
            };
        } else {
            // Mark as failed
            await this.db.db
                .update(transactions)
                .set({ status: 'failed' })
                .where(eq(transactions.id, txn.id));

            throw new BadRequestException('Payment was not successful');
        }
    }

    async handleWebhook(event: string, data: any) {
        if (event !== 'charge.completed') return;
        if (data.status !== 'successful') return;

        const reference = data.tx_ref;
        const txnResult = await this.db.db
            .select()
            .from(transactions)
            .where(eq(transactions.reference, reference))
            .limit(1);

        const txn = txnResult[0];
        if (!txn || txn.status === 'successful') return;

        const amount = data.amount;

        // Credit wallet
        await this.db.db
            .update(wallets)
            .set({
                balance: sql`${wallets.balance} + ${amount}`,
                updatedAt: new Date(),
            })
            .where(eq(wallets.userId, txn.userId));

        // Update transaction
        await this.db.db
            .update(transactions)
            .set({ status: 'successful' })
            .where(eq(transactions.id, txn.id));
    }
}
