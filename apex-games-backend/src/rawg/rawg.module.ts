import { Module } from '@nestjs/common';
import { RawgService } from './rawg.service';
import { RawgTestController } from './rawgTestController';

@Module({
  providers: [RawgService],
  exports: [RawgService],
  controllers: [RawgTestController]
})
export class RawgModule {}
