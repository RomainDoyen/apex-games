import { Module } from '@nestjs/common';
import { GameCacheService } from './game-cache.service';
import { SupabaseModule } from '../supabase/module';
import { RawgModule } from '../rawg/rawg.module';

@Module({
  imports: [SupabaseModule, RawgModule],
  providers: [GameCacheService],
  exports: [GameCacheService],
})
export class GameCacheModule {}
