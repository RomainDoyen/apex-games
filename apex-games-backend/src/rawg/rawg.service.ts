import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, map } from 'rxjs'; 
import { RawgGame, RawgGameListResponse } from './interfaces/game.interface';

@Injectable()
export class RawgService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly logger = new Logger(RawgService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = 'https://api.rawg.io/api';
    const key = this.configService.get<string>('RAWG_API_KEY');

    if (!key) {
      throw new InternalServerErrorException('RAWG_API_KEY est manquant dans les variables d\'environnement.');
    }
    this.apiKey = key;
  }

  //récupérer tous les jeux
   async getGames(): Promise<RawgGame[]> {
    const url = `${this.baseUrl}/games`;
    const params = {
      key: this.apiKey
    };

    this.logger.debug(`Recupération de tous les jeux`);

    const data = await firstValueFrom(
      this.httpService.get<RawgGameListResponse>(url, { params }).pipe(
        catchError(error => {
          this.logger.error(`Erreur lors de la récupération des jeux RAWG: ${error.message}`, error.stack);
          throw new InternalServerErrorException('Erreur de communication avec l\'API RAWG.');
        }),
        map(response => response.data) 
      ),
    );
    return data.results;
  }
  
  //chercher des jeux (pour la page d'accueil/recherche)
  async searchGames(query: string, page = 1, pageSize = 20): Promise<RawgGame[]> {
    const url = `${this.baseUrl}/games`;
    const params = {
      key: this.apiKey,
      search: query,
      page: page,
      page_size: pageSize,
    };

    this.logger.debug(`Recherche de jeux sur RAWG: ${query}, page ${page}`);

    const data = await firstValueFrom(
      this.httpService.get<RawgGameListResponse>(url, { params }).pipe(
        catchError(error => {
          this.logger.error(`Erreur lors de la recherche RAWG: ${error.message}`, error.stack);
          throw new InternalServerErrorException('Erreur de communication avec l\'API RAWG.');
        }),
        map(response => response.data) //juste le corps de la réponse
      ),
    );
    return data.results;
  }

  // Méthode pour obtenir les détails complets d'un jeu par son ID
  async getGameDetails(id: number): Promise<RawgGame> {
    const url = `${this.baseUrl}/games/${id}`;
    const params = {
      key: this.apiKey,
    };

    this.logger.debug(`Récupération des détails du jeu RAWG pour l'ID: ${id}`);

    const data = await firstValueFrom(
      this.httpService.get<RawgGame>(url, { params }).pipe(
        catchError(error => {
          this.logger.error(`Erreur lors de la récupération des détails RAWG pour l'ID ${id}: ${error.message}`, error.stack);
          // Gérer le cas où le jeu n'est pas trouvé (par exemple, NotFoundException)
          throw new InternalServerErrorException(`Erreur de communication avec l'API RAWG pour l'ID ${id}.`);
        }),
        map(response => response.data)
      ),
    );
    return data;
  }
}