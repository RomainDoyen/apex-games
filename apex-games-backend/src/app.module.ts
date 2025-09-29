

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/module'; 

@Module({
  imports: [
    // configure le module de configuration pour qu'il soit GLOBAL
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    
    SupabaseModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}