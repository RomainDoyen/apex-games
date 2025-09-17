export interface ButtonProps {
    text: string;
    color: string;
    backgroundColor: string;
    link: string;
}

export interface CardProps {
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
    status?: 'A faire' | 'En cours' | 'Termine' | 'Platine';
}