

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/module'; 
import { BacklogModule } from './backlog/backlog.module';
import { RawgModule } from './rawg/rawg.module';
import { GameCacheModule } from './game-cache/game-cache.module';


@Module({
  imports: [
    // configure le module de configuration pour qu'il soit GLOBAL
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    
    SupabaseModule,
    
    BacklogModule,
    
    RawgModule,
    
    GameCacheModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}