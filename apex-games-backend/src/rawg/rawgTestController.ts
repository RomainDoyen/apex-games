import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import { RawgService } from './rawg.service';

// Ex: GET http://localhost:3000/rawg-test/games
@Controller('rawg-test')
export class RawgTestController {
  private readonly logger = new Logger(RawgTestController.name);

  constructor(private readonly rawgService: RawgService) {}

  // Ex: GET http://localhost:3000/rawg-test/search?query=witcher
  @Get('games')
  async testAllGames() {
    this.logger.log(`Test de récupération de tous les jeux`);
    return this.rawgService.getGames();
  }

  //tester la recherche de jeux
  // Ex: GET http://localhost:3000/rawg-test/search?query=witcher
  @Get('search')
  async testSearch(@Query('query') query: string) {
    if (!query) {
      return { message: 'Veuillez fournir un paramètre "query".' };
    }
    this.logger.log(`Test de recherche RAWG pour : ${query}`);
    return this.rawgService.searchGames(query);
  }

  //tester la récupération des détails d'un jeu
  // Ex: GET http://localhost:3000/rawg-test/details/3498 (ID GTA V)
  @Get('details/:id')
  async testGetDetails(@Param('id') id: string) {
    if (!id) {
      return { message: 'Veuillez fournir un ID de jeu.' };
    }
    const gameId = parseInt(id, 10);
    if (isNaN(gameId)) {
      return { message: "L'ID doit être un nombre." };
    }
    this.logger.log(
      `Test de récupération des détails RAWG pour l'ID : ${gameId}`,
    );
    return this.rawgService.getGameDetails(gameId);
  }
}
