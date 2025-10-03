import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BacklogService } from './backlog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/interfaces/auth.interface';

@Controller('backlog')
@UseGuards(ThrottlerGuard, JwtAuthGuard)
export class BacklogController {
  constructor(private readonly backlogService: BacklogService) {}

  @Post()
  async addGame(
    @CurrentUser() user: User,
    @Body() body: { rawgId: number; status: string },
  ) {
    return this.backlogService.addGame(user.id, body.rawgId, body.status);
  }

  @Get()
  async getBacklog(@CurrentUser() user: User) {
    return this.backlogService.getBacklog(user.id);
  }

  @Patch(':rawgId/status')
  async updateStatus(
    @CurrentUser() user: User,
    @Param('rawgId', ParseIntPipe) rawgId: number,
    @Body() body: { status: string },
  ) {
    return this.backlogService.updateStatus(user.id, rawgId, body.status);
  }

  @Delete(':rawgId')
  async removeGame(
    @CurrentUser() user: User,
    @Param('rawgId', ParseIntPipe) rawgId: number,
  ) {
    return this.backlogService.removeGame(user.id, rawgId);
  }
}
