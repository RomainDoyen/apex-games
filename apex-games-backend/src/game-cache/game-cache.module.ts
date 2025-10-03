
import { Module } from '@nestjs/common';
import { GameCacheService } from './game-cache.service';
import { SupabaseModule } from '../supabase/module'; 
import { RawgModule } from '../rawg/rawg.module';       // Pour appeler l'API RAWG
import { GameCacheController } from './game-cache.controller';

@Module({
  imports: [SupabaseModule, RawgModule],
  providers: [GameCacheService],
  exports: [GameCacheService],
  controllers: [GameCacheController], 
})
export class GameCacheModule {}