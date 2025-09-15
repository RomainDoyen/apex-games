import React from 'react';
import type { Game } from '../../types/types' 
import GameCard from './Card';
import "../../styles/components/BacklogColumn.css";

interface BacklogColumnProps {
    title: string;
    status: Game['status'];
    games: Game[];
    onMoveGame: (gameId: number, newStatus: Game['status']) => void;
}

export default function BacklogColumn({ title, status, games, onMoveGame }: BacklogColumnProps) {
    // Gestion du glisser-déposer (Drag and Drop)
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Nécessaire pour permettre le drop
    };

    const handleDrop = (e: React.DragEvent) => {
        const gameId = parseInt(e.dataTransfer.getData('gameId'));
        onMoveGame(gameId, status);
    };

    return (
        <div 
            className="backlog-column"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <h2>{title}</h2>
            <div className="games-list">
                {games.map(game => (
                    <GameCard key={game.id} title={game.name} image={game.background_image} />
                ))}
            </div>
        </div>
    );
}