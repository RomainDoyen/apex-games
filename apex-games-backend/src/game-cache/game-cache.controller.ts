
import { Controller, Get, Param, Logger } from '@nestjs/common';
import { GameCacheService } from './game-cache.service';

@Controller('cache-test') 
export class GameCacheController {
  private readonly logger = new Logger(GameCacheController.name);

  constructor(private readonly service: GameCacheService) {}


  //tester la mise en cache d'un jeu
  // Ex: GET http://localhost:3000/cache-test/58175
  @Get(':rawgId')
  async testCache(@Param('rawgId') rawgId: number) {
    if (!rawgId) {
      return { message: 'Veuillez fournir un id de jeu à vérifier.' };
    }
    return this.service.findOrCreateAndGetGame(rawgId);
  }
}