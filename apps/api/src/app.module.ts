import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: validateEnv,
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
            },
        ]),
        DatabaseModule,
        RedisModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
