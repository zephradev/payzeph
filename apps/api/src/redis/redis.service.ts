import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client!: Redis;

    constructor(private configService: ConfigService) {}

    onModuleInit() {
        this.client = new Redis(this.configService.get<string>('REDIS_URL')!);
        console.log('Redis connected!');
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    async set(key: string, value: string, ttlSeconds?: number) {
        if (ttlSeconds) {
            await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
            await this.client.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async del(key: string) {
        await this.client.del(key);
    }
}
