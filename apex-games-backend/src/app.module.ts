

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SupabaseModule } from './supabase/module';
import { RawgModule } from './rawg/rawg.module';
import { GameCacheModule } from './game-cache/game-cache.module';
import { BacklogModule } from './backlog/backlog.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    // configure le module de configuration pour qu'il soit GLOBAL
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate limiting global
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requêtes par minute par IP
      },
    ]),

    SupabaseModule,
    RawgModule,
    GameCacheModule,
    BacklogModule,
    AuthModule,
    AdminModule,
    EmailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}