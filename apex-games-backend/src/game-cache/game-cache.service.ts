import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RawgService } from '../rawg/rawg.service';

@Injectable()
export class GameCacheService {
  private readonly logger = new Logger(GameCacheService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly rawgService: RawgService,
  ) {}

  /**
   * Récupère un jeu depuis le cache ou le télécharge depuis RAWG
   */
  async getOrFetchGame(rawgId: number) {
    const client = this.supabaseService.client;

    // 1. Vérifier si le jeu existe déjà en cache
    const { data: cachedGame, error: fetchError } = await client
      .from('GameCache')
      .select('*')
      .eq('rawg_id', rawgId)
      .single();

    if (cachedGame) {
      this.logger.log(`📦 Jeu #${rawgId} trouvé en cache: ${cachedGame.name}`);
      return cachedGame;
    }

    // Ignorer l'erreur PGRST116 (aucune ligne trouvée)
    if (fetchError && fetchError.code !== 'PGRST116') {
      this.logger.error(
        `Erreur lors de la lecture du cache:`,
        fetchError.message,
      );
    }

    // 2. Si pas en cache, récupérer depuis RAWG
    this.logger.log(
      `🌐 Jeu #${rawgId} non trouvé en cache, récupération depuis RAWG...`,
    );
    const gameData = await this.rawgService.getGameById(rawgId);

    // 3. Sauvegarder dans le cache
    const { data: savedGame, error: insertError } = await client
      .from('GameCache')
      .insert(gameData)
      .select()
      .single();

    if (insertError) {
      this.logger.error(
        `❌ Erreur lors de la sauvegarde en cache:`,
        insertError.message,
      );
      throw new Error(
        `Impossible de sauvegarder le jeu en cache: ${insertError.message}`,
      );
    }

    this.logger.log(`✅ Jeu #${rawgId} ajouté au cache: ${savedGame.name}`);
    return savedGame;
  }

  /**
   * Vérifie si un jeu existe en cache
   */
  async gameExistsInCache(rawgId: number): Promise<boolean> {
    const client = this.supabaseService.client;

    const { data, error } = await client
      .from('GameCache')
      .select('rawg_id')
      .eq('rawg_id', rawgId)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.logger.error(`Erreur lors de la vérification:`, error.message);
    }

    return !!data;
  }
}
