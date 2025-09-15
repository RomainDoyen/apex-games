export interface ButtonProps {
    text: string;
    color: string;
    backgroundColor: string;
    link: string;
}

export interface CardProps {
    title: string;
    image: string;
    game?: Game;
}

export interface CompteurProps {
    title: string;
    value: number;
    valueMetrics: string;
    pastilleColor: string;
}

export interface GameCardProps {
    title: string;
    image: string;
    description?: string;
}

export interface ImageProps {
    src: string;
    alt: string;
    className?: string;
}

export interface InputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className: string;
    icon: React.ReactNode;
}

export interface SpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
}

export interface Game {
    id: number;
    name: string;
    background_image: string;
    rating: number;
    rating_count?: number;
    released?: string;
    description?: string;
    description_raw?: string;
    metacritic?: number;
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
    screenshots?: Array<{
        id: number;
        image: string;
    }>;
    short_screenshots?: Array<{
        id: number;
        image: string;
    }>;
}

export interface Bookmark {
    gameId: number;
    gameName: string;
    gameImage: string;
    addedAt: Date;
}