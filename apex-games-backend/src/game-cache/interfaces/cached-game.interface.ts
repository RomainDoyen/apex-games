export interface CachedGame {
  rawg_id: number;
  name: string;
  image_url: string | null;
  metacritic_score: number | null;
  released_date: string | null; // Format 'YYYY-MM-DD'
  cached_at: string; // ISO string de la date de mise en cache
}
