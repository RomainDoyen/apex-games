import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { ConfigModule } from '@nestjs/config'; // Pour accéder à la clé API
import { RawgService } from './rawg.service';
import { RawgTestController } from './rawgTestController'; //test

@Module({
  imports: [
    HttpModule, 
    ConfigModule 
  ],
  controllers: [RawgTestController],
  providers: [RawgService],
  exports: [RawgService], 
})
export class RawgModule {}