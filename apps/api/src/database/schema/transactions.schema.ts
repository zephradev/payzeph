import {
    pgTable,
    uuid,
    bigint,
    varchar,
    text,
    timestamp,
    pgEnum,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { schemaTimestamp } from 'src/utils/helpers';

export const transactionTypeEnum = pgEnum('transaction_type', [
    'wallet_funding',
    'airtime',
    'data',
    'electricity',
    'cable_tv',
    'internet',
]);

export const transactionStatusEnum = pgEnum('transaction_status', [
    'pending',
    'successful',
    'failed',
]);

export const transactions = pgTable('transactions', {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
        .references(() => users.id)
        .notNull(),
    type: transactionTypeEnum('type').notNull(),
    status: transactionStatusEnum('status').default('pending').notNull(),
    amount: bigint('amount', { mode: 'number' }).notNull(),
    reference: varchar('reference', { length: 100 }).notNull().unique(),
    provider: varchar('provider', { length: 50 }),
    metadata: text('metadata'),
    ...schemaTimestamp,
});
