import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { GameCacheService } from '../game-cache/game-cache.service';

@Injectable()
export class BacklogService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly gameCacheService: GameCacheService,
  ) {}

  // Ajout (POST /backlog)
  async addGame(userId: string, rawgId: number, status: string, title: string, imageUrl: string) {
    const client = this.supabaseService.client;

    // 1. Vérifier si le jeu existe déjà dans le backlog
    const { data: existing } = await client
      .from('BacklogGames')
      .select('rawg_id, status')
      .eq('user_id', userId)
      .eq('rawg_id', rawgId)
      .single();

    if (existing) {
      throw new ConflictException(
        `Ce jeu est déjà dans votre backlog avec le statut: ${existing.status}`,
      );
    }

    // 3. Insertion dans la table BacklogGames
    const { data, error } = await client
      .from('BacklogGames')
      .insert({
        user_id: userId,
        rawg_id: rawgId,
        status: status,
        title: title,
        image_url: imageUrl,
        added_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      // Gestion spécifique des erreurs de contrainte unique
      if (error.code === '23505' || error.message.includes('duplicate')) {
        throw new ConflictException(`Ce jeu est déjà dans votre backlog`);
      }
      throw new InternalServerErrorException(
        `Erreur Supabase lors de l'ajout: ${error.message}`,
      );
    }
    return data;
  }

   
  // (GET /backlog)
  async getBacklog(userId: string) {
    const client = this.supabaseService.client;

    // Récupérer les entrées du backlog et les joindre au cache des jeux
    const { data, error } = await client
      .from('BacklogGames')
      .select(
       `*`,
      )
      .eq('user_id', userId); // Filtrer par l'utilisateur

    if (error) {
      throw new InternalServerErrorException(
        `Erreur Supabase lors de la lecture: ${error.message}`,
      );
    }

    return data;
  }

  //(PATCH /backlog/:rawgId/status)
  async updateStatus(userId: string, rawgId: number, newStatus: string) {
    const client = this.supabaseService.client;

    const { data, error } = await client
      .from('BacklogGames')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('rawg_id', rawgId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `Erreur Supabase lors de la mise à jour: ${error.message}`,
      );
    }

    return data;
  }

  // (DELETE /backlog/:rawgId)
  async removeGame(userId: string, rawgId: number) {
    const client = this.supabaseService.client;

    const { error } = await client
      .from('BacklogGames')
      .delete()
      .eq('user_id', userId)
      .eq('rawg_id', rawgId);

    if (error) {
      throw new InternalServerErrorException(
        `Erreur Supabase lors de la suppression: ${error.message}`,
      );
    }

    return { success: true, rawgId };
  }
}
