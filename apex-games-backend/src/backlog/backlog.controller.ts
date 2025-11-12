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
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BacklogService } from './backlog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/interfaces/auth.interface';
import { createBacklogGameDto } from './dto/create-backlog-game-dto';
import { UpdateStatusDto } from './dto/update-status-dto';

@Controller('backlog')
@UseGuards(ThrottlerGuard, JwtAuthGuard)
export class BacklogController {
  constructor(private readonly backlogService: BacklogService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async addGame(
    @CurrentUser() user: User,
    @Body() dto: createBacklogGameDto,
  ) {
    return this.backlogService.addGame(
      user.id,
      dto.rawgId,
      dto.status ?? 'to-play',
      dto.title,
      dto.image,
    );
  }

  @Get()
  async getBacklog(@CurrentUser() user: User) {
    return this.backlogService.getBacklog(user.id);
  }

 @Patch(':rawgId/status')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateStatus(
    @CurrentUser() user: User,
    @Param('rawgId', ParseIntPipe) rawgId: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.backlogService.updateStatus(user.id, rawgId, dto.status);
  }

  @Delete(':rawgId')
  async removeGame(
    @CurrentUser() user: User,
    @Param('rawgId', ParseIntPipe) rawgId: number,
  ) {
    return this.backlogService.removeGame(user.id, rawgId);
  }
}
