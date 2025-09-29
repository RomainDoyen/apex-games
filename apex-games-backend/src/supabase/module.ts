import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Module({
  
  providers: [SupabaseService], 
  // EXPORTÉ : pour que d'autres modules puissent utiliser SupabaseService
  exports: [SupabaseService],
})
export class SupabaseModule {}