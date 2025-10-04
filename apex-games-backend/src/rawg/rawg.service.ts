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

  /**
   * Récupère la liste des jeux populaires depuis l'API RAWG
   */
  async getGames() {
    if (!this.apiKey) {
      throw new Error('RAWG_API_KEY non configurée');
    }

    try {
      const url = `${this.baseUrl}/games?key=${this.apiKey}&page_size=20`;
      this.logger.log('🎮 Récupération des jeux populaires depuis RAWG...');

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Erreur RAWG API: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      this.logger.log(`✅ ${data.results.length} jeux récupérés`);

      return {
        results: data.results,
        count: data.count,
        next: data.next,
        previous: data.previous,
      };
    } catch (error) {
      this.logger.error('❌ Erreur lors de la récupération des jeux:', error);
      throw error;
    }
  }

  /**
   * Recherche des jeux par nom
   */
  async searchGames(query: string) {
    if (!this.apiKey) {
      throw new Error('RAWG_API_KEY non configurée');
    }

    try {
      const url = `${this.baseUrl}/games?key=${this.apiKey}&search=${encodeURIComponent(query)}&page_size=20`;
      this.logger.log(`🔍 Recherche RAWG pour: ${query}`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Erreur RAWG API: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      this.logger.log(`✅ ${data.results.length} résultats trouvés pour "${query}"`);

      return {
        results: data.results,
        count: data.count,
        next: data.next,
        previous: data.previous,
        query: query,
      };
    } catch (error) {
      this.logger.error(`❌ Erreur lors de la recherche pour "${query}":`, error);
      throw error;
    }
  }

  /**
   * Récupère les détails complets d'un jeu
   */
  async getGameDetails(gameId: number) {
    if (!this.apiKey) {
      throw new Error('RAWG_API_KEY non configurée');
    }

    try {
      const url = `${this.baseUrl}/games/${gameId}?key=${this.apiKey}`;
      this.logger.log(`🎮 Récupération des détails du jeu #${gameId} depuis RAWG...`);

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException(
            `Le jeu avec l'ID ${gameId} n'existe pas sur RAWG`,
          );
        }
        throw new Error(
          `Erreur RAWG API: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      this.logger.log(`✅ Détails récupérés pour: ${data.name}`);

      return {
        id: data.id,
        name: data.name,
        description: data.description_raw || data.description,
        background_image: data.background_image,
        background_image_additional: data.background_image_additional,
        website: data.website,
        metacritic: data.metacritic,
        metacritic_platforms: data.metacritic_platforms,
        released: data.released,
        tba: data.tba,
        rating: data.rating,
        rating_top: data.rating_top,
        ratings: data.ratings,
        ratings_count: data.ratings_count,
        playtime: data.playtime,
        screenshots_count: data.screenshots_count,
        movies_count: data.movies_count,
        creators_count: data.creators_count,
        achievements_count: data.achievements_count,
        parent_achievements_count: data.parent_achievements_count,
        reddit_url: data.reddit_url,
        reddit_name: data.reddit_name,
        reddit_description: data.reddit_description,
        reddit_logo: data.reddit_logo,
        reddit_count: data.reddit_count,
        twitch_count: data.twitch_count,
        youtube_count: data.youtube_count,
        reviews_text_count: data.reviews_text_count,
        suggestions_count: data.suggestions_count,
        alternative_names: data.alternative_names,
        metacritic_url: data.metacritic_url,
        parents_count: data.parents_count,
        additions_count: data.additions_count,
        game_series_count: data.game_series_count,
        user_game: data.user_game,
        reviews_count: data.reviews_count,
        saturated_color: data.saturated_color,
        dominant_color: data.dominant_color,
        platforms: data.platforms,
        parent_platforms: data.parent_platforms,
        genres: data.genres,
        stores: data.stores,
        clip: data.clip,
        tags: data.tags,
        esrb_rating: data.esrb_rating,
        short_screenshots: data.short_screenshots,
      };
    } catch (error) {
      this.logger.error(
        `❌ Erreur lors de la récupération des détails du jeu #${gameId}:`,
        error,
      );
      throw error;
    }
  }
}
