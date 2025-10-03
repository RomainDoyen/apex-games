import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RawgService {
  private readonly logger = new Logger(RawgService.name);
  private readonly apiKey: string | undefined;
  private readonly baseUrl = 'https://api.rawg.io/api';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('RAWG_API_KEY');
    if (!this.apiKey) {
      this.logger.warn(
        '⚠️  RAWG_API_KEY non définie. Le service RAWG ne fonctionnera pas.',
      );
    }
  }

  /**
   * Récupère les détails d'un jeu depuis l'API RAWG
   */
  async getGameById(rawgId: number) {
    if (!this.apiKey) {
      throw new Error('RAWG_API_KEY non configurée');
    }

    try {
      const url = `${this.baseUrl}/games/${rawgId}?key=${this.apiKey}`;
      this.logger.log(`🎮 Récupération du jeu #${rawgId} depuis RAWG...`);

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException(
            `Le jeu avec l'ID ${rawgId} n'existe pas sur RAWG`,
          );
        }
        throw new Error(
          `Erreur RAWG API: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      this.logger.log(`✅ Jeu récupéré: ${data.name}`);

      return {
        rawg_id: data.id,
        name: data.name,
        image_url: data.background_image || null,
        metacritic_score: data.metacritic || null,
        released: data.released || null,
        description: data.description_raw || null,
        playtime: data.playtime || 0,
        website: data.website || null,
      };
    } catch (error) {
      this.logger.error(
        `❌ Erreur lors de la récupération du jeu #${rawgId}:`,
        error,
      );
      throw error;
    }
  }
}
