import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool!: Pool;
    public db!: ReturnType<typeof drizzle>;

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        this.pool = new Pool({
            connectionString: this.configService.get<string>('DATABASE_URL'),
        });
        this.db = drizzle(this.pool, { schema });
        console.log('Database connected');
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}
