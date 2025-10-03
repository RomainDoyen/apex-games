export interface RawgGame {
    id: number;
    name: string;
    background_image: string | null;
    metacritic: number | null;
    released: string | null; // Format 'YYYY-MM-DD'
    description_raw?: string;
    rating?: number;
    rating_count?: number;
    playtime?: number;
    platforms?: Array<{
        platform: {
            id: number;
            name: string;
        };
    }>;
    genres?: Array<{
        id: number;
        name: string;
    }>;
    developers?: Array<{
        id: number;
        name: string;
    }>;
    publishers?: Array<{
        id: number;
        name: string;
    }>;
    website?: string;
    reddit_url?: string;
    short_screenshots?: Array<{
        id: number;
        image: string;
    }>;
}

export interface RawgGameListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: RawgGame[];
}