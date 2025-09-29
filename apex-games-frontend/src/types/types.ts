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

export interface MovableCardProps {
    id: number;
    title: string;
    image: string;
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
    name?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    icon?: React.ReactNode;
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
    status?: 'A faire' | 'En cours' | 'Termine' | 'Platine';
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


export interface BacklogColumnProps {
    title: string;
    status: Game['status'];
    games: Game[];
    onMoveGame: (gameId: number, newStatus: Game['status']) => void;
}


export interface Bookmark {
    gameId: number;
    gameName: string;
    gameImage: string;
    addedAt: Date;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AddGameFormData {
    name: string;
    description: string;
    background_image: string;
    rating: number;
    released: string;
    metacritic: number;
    website: string;
    genres: string;
    developers: string;
    publishers: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'admin';
}

export interface GameReview {
    id?: number;
    gameId: number;
    userId: number;
    rating: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameId: number;
    gameName: string;
    onSubmit: (review: Omit<GameReview, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

