import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [LinksModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
