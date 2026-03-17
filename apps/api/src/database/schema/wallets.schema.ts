import { pgTable, bigint, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { schemaTimestamp } from 'src/utils/helpers';

export const wallets = pgTable('wallets', {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
        .references(() => users.id)
        .notNull()
        .unique(),
    balance: bigint('balance', { mode: 'number' }).default(0).notNull(),
    ...schemaTimestamp,
});
