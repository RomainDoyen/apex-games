import { Module } from '@nestjs/common';
import { RawgService } from './rawg.service';
import { RawgController } from './rawgController';

@Module({
  providers: [RawgService],
  exports: [RawgService],
  controllers: [RawgController]
})
export class RawgModule {}
