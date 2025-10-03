<<<<<<< Updated upstream
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
=======

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/module';
import { RawgModule } from './rawg/rawg.module';
import { GameCacheModule } from './game-cache/game-cache.module';
import { BacklogModule } from './backlog/backlog.module';

@Module({
  imports: [
    // configure le module de configuration pour qu'il soit GLOBAL
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SupabaseModule,
    RawgModule,
    GameCacheModule,
    BacklogModule,
  ],
  controllers: [],
  providers: [],
>>>>>>> Stashed changes
})
export class AppModule {}
