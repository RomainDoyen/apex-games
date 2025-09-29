import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { BacklogService } from './backlog.service';

const DUMMY_USER_ID = 'eae145c1-34b0-4aa4-9642-7a73c30ed673'; // A VIRER PLUS TARD (TEST)

@Controller('backlog') 
export class BacklogController {
  constructor(private readonly backlogService: BacklogService) {}
  
  // TODO: Dans un vrai scénario récup l'ID user via l'authentification (e.g., @Req() ou un Guard)

  // Ajout d'un jeu au backlog
  @Post()
  async addGameToBacklog(@Body('rawgId') rawgId: number, @Body('status') status: string) {
    const userId = DUMMY_USER_ID;  //TODO **************A VIRER BIEN SUR CEST DEGEULASSE**************
    return this.backlogService.addGame(userId, rawgId, status);
  }

  // Récupération du backlog de l'utilisateur
  @Get()
  async getUserBacklog() {
    const userId = DUMMY_USER_ID;
    return this.backlogService.getBacklog(userId);
  }
  
  // Modification du statut d'un jeu
  @Patch(':rawgId/status')
  async updateGameStatus(@Param('rawgId') rawgId: number, @Body('newStatus') newStatus: string) {
    const userId = DUMMY_USER_ID;
    return this.backlogService.updateStatus(userId, parseInt(rawgId.toString()), newStatus); 
  }

  // Suppression d'un jeu du backlog
  @Delete(':rawgId')
  async removeGameFromBacklog(@Param('rawgId') rawgId: number) {
    const userId = DUMMY_USER_ID;
    return this.backlogService.removeGame(userId, parseInt(rawgId.toString()));
  }
}