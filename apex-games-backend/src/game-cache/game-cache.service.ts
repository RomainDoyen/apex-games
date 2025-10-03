
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RawgService } from '../rawg/rawg.service';
import { CachedGame } from './interfaces/cached-game.interface';
import { RawgGame } from '../rawg/interfaces/game.interface';

@Injectable()
export class GameCacheService {
  private readonly logger = new Logger(GameCacheService.name);
  private readonly CACHE_DURATION_HOURS = 24; // Durée de validité du cache en heures

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly rawgService: RawgService,
  ) {}

  /**
   * Vérifie si un jeu est dans le cache et si ses données sont encore valides.
   * Si non, il l'appelle via RawgService et le met en cache.
   * Retourne les données du jeu depuis le cache.
   */
  async findOrCreateAndGetGame(rawgId: number): Promise<CachedGame> {
    this.logger.debug(`Recherche du jeu RAWG ID ${rawgId} dans le cache...`);

    // 1. Tenter de récupérer le jeu du cache
    const cachedGame = await this.getGameFromCache(rawgId);

    if (cachedGame && !this.isCacheExpired(cachedGame.cached_at)) {
      this.logger.debug(`Jeu RAWG ID ${rawgId} trouvé dans le cache et valide.`);
      return cachedGame; // Le cache est bon, on le retourne
    }

    // 2. Si non trouvé ou expiré, appeler l'API RAWG
    this.logger.log(`Jeu RAWG ID ${rawgId} manquant ou expiré. Appel de l'API RAWG...`);
    let rawgGame: RawgGame;
    try {
      rawgGame = await this.rawgService.getGameDetails(rawgId);
    } catch (error) {
      this.logger.error(`Erreur lors de l'appel à RAWG pour l'ID ${rawgId}: ${error.message}`);
      throw new InternalServerErrorException(`Impossible de récupérer les détails du jeu RAWG ID ${rawgId}.`);
    }

    // 3. Mettre à jour ou insérer dans le cache
    const newCacheEntry: CachedGame = {
      rawg_id: rawgGame.id,
      name: rawgGame.name,
      image_url: rawgGame.background_image,
      metacritic_score: rawgGame.metacritic,
      released_date: rawgGame.released,
      cached_at: new Date().toISOString(), // Date actuelle
    };

    if (cachedGame) {
      this.logger.debug(`Mise à jour du cache pour le jeu RAWG ID ${rawgId}.`);
      await this.updateGameInCache(newCacheEntry);
    } else {
      this.logger.debug(`Insertion du jeu RAWG ID ${rawgId} dans le cache.`);
      await this.insertGameIntoCache(newCacheEntry);
    }

    return newCacheEntry; // Retourne la nouvelle entrée cachée
  }

  private async getGameFromCache(rawgId: number): Promise<CachedGame | null> {
    const { data, error } = await this.supabaseService.client
      .from('GameCache')
      .select('*')
      .eq('rawg_id', rawgId)
      .maybeSingle(); // Utilise maybeSingle pour obtenir null si non trouvé

    if (error && error.code !== 'PGRST116') { // PGRST116 = pas de ligne trouvée, ce qui est OK
      this.logger.error(`Erreur Supabase lors de la lecture du cache pour l'ID ${rawgId}: ${error.message}`);
      throw new InternalServerErrorException('Erreur lors de la récupération du cache du jeu.');
    }
    return data ? (data as CachedGame) : null;
  }

  private async insertGameIntoCache(game: CachedGame): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('GameCache')
      .insert(game);

    if (error) {
      this.logger.error(`Erreur Supabase lors de l'insertion du jeu ${game.rawg_id} dans le cache: ${error.message}`);
      throw new InternalServerErrorException('Erreur lors de l\'insertion du jeu dans le cache.');
    }
  }

  private async updateGameInCache(game: CachedGame): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('GameCache')
      .update(game)
      .eq('rawg_id', game.rawg_id);

    if (error) {
      this.logger.error(`Erreur Supabase lors de la mise à jour du jeu ${game.rawg_id} dans le cache: ${error.message}`);
      throw new InternalServerErrorException('Erreur lors de la mise à jour du jeu dans le cache.');
    }
  }

  private isCacheExpired(cachedAt: string): boolean {
    const cacheDate = new Date(cachedAt);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60);
    return diffHours >= this.CACHE_DURATION_HOURS;
  }
}