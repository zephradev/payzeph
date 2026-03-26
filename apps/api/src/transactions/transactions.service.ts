import { Injectable } from '@nestjs/common';
import { eq, desc, sql, and, count } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { transactions } from '../database/schema';

@Injectable()
export class TransactionsService {
    constructor(private db: DatabaseService) {}

    async getTransactions(
        userId: string,
        page: number = 1,
        perPage: number = 10,
    ) {
        const offset = (page - 1) * perPage;

        const [data, totalResult] = await Promise.all([
            this.db.db
                .select()
                .from(transactions)
                .where(eq(transactions.userId, userId))
                .orderBy(desc(transactions.createdAt))
                .limit(perPage)
                .offset(offset),
            this.db.db
                .select({ count: count() })
                .from(transactions)
                .where(eq(transactions.userId, userId)),
        ]);

        const total = totalResult[0]?.count ?? 0;

        // Map DB format to frontend format
        const mapped = data.map((txn) => ({
            id: txn.id,
            type: this.mapType(txn.type),
            description: this.buildDescription(txn),
            amount: txn.amount,
            status: this.mapStatus(txn.status),
            reference: txn.reference,
            date: txn.createdAt.toISOString(),
            meta: txn.metadata ? JSON.parse(txn.metadata) : undefined,
        }));

        return {
            data: mapped,
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
        };
    }

    private mapType(dbType: string): string {
        const typeMap: Record<string, string> = {
            wallet_funding: 'wallet-funding',
            cable_tv: 'cable-tv',
        };
        return typeMap[dbType] || dbType;
    }

    private mapStatus(dbStatus: string): string {
        const statusMap: Record<string, string> = {
            successful: 'success',
        };
        return statusMap[dbStatus] || dbStatus;
    }

    private buildDescription(txn: any): string {
        const meta = txn.metadata ? JSON.parse(txn.metadata) : {};

        switch (txn.type) {
            case 'wallet_funding':
                return 'Wallet Funding via Card';
            case 'airtime':
                return `${(txn.provider || 'Airtime').toUpperCase()} Airtime - ${meta.phone || ''}`;
            case 'data':
                return `${(txn.provider || 'Data').toUpperCase()} ${meta.bundleName || 'Data'} - ${meta.phone || ''}`;
            case 'electricity':
                return `${(meta.disco || 'Electric').toUpperCase()} ${meta.meterType || 'Prepaid'} - ${meta.meterNumber || ''}`;
            case 'cable_tv':
                return `${(txn.provider || 'Cable').toUpperCase()} ${meta.bouquetName || 'Subscription'} - ${meta.smartcardNumber || ''}`;
            default:
                return `${txn.type} transaction`;
        }
    }
}
