import {
    pgTable,
    varchar,
    text,
    timestamp,
    pgEnum,
    uuid,
} from 'drizzle-orm/pg-core';
import { schemaTimestamp } from 'src/utils/helpers';

export const roleEnum = pgEnum('role', ['user', 'admin']);
export const kycStatusEnum = pgEnum('kyc_status', [
    'basic',
    'verified',
    'premium',
]);

export const users = pgTable('users', {
    id: uuid('id').primaryKey(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 20 }).unique(),
    passwordHash: text('password_hash').notNull(),
    avatar: text('avatar'),
    role: roleEnum('role').default('user').notNull(),
    kycStatus: kycStatusEnum('kyc_status').default('basic').notNull(),
    isVerified: varchar('is_verified', { length: 5 }).default('false'),
    ...schemaTimestamp,
});
