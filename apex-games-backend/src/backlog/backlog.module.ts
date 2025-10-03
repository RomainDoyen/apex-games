import { Module } from '@nestjs/common';
import { BacklogService } from './backlog.service';
import { BacklogController } from './backlog.controller';
import { SupabaseModule } from '../supabase/module';
import { GameCacheModule } from '../game-cache/game-cache.module';

@Module({
  imports: [SupabaseModule, GameCacheModule],
  controllers: [BacklogController],
  providers: [BacklogService],
})
export class BacklogModule {}