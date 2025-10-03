import { Module } from '@nestjs/common';
import { RawgService } from './rawg.service';

@Module({
  providers: [RawgService],
  exports: [RawgService],
})
export class RawgModule {}
