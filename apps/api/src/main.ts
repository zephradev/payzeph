import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.enableCors({
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`API running on http://localhost:${port}/api`);
}

void bootstrap();
