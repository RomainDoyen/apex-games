import { Module } from '@nestjs/common';
import { BacklogService } from './backlog.service';
import { BacklogController } from './backlog.controller';
import { SupabaseModule } from '../supabase/module';

@Module({
  imports: [SupabaseModule], 
  controllers: [BacklogController],
  providers: [BacklogService],
})
export class BacklogModule {}