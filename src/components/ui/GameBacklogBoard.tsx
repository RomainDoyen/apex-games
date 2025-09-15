import React, { useState } from 'react';
import type { Game } from '../../types/types' 
import BacklogColumn from './BacklogColumn';
import "../../styles/components/GameBacklogBoard.css";


/*****************************A FAIRE**********************************************
 * Créer un composant spécifique card et le rendre DRAGGABLE 
 * afficher les datas de l'api et pas des mockdata à la con
 * Trouver un travail
 ***********************************************************************************/
// mock data
const initialGames: Game[] = [
    { id: 1, name: 'Cyberpunk 2077', background_image: '...', rating: 3.5, status: 'A faire' },
    { id: 2, name: 'Farming simulator 974', background_image: '...', rating: 3.5, status: 'A faire' },
    { id: 3, name: 'The Witcher 3', background_image: '...', rating: 4.8, status: 'En cours' },
    { id: 4, name: 'Hogwarts Legacy', background_image: '...', rating: 4.2, status: 'Termine' },
    { id: 5, name: 'Elden Ring', background_image: '...', rating: 4.6, status: 'Platine' },
];

export default function GameBacklogBoard() {
    const [games, setGames] = useState<Game[]>(initialGames);

    // Fonction pour déplacer un jeu d'une colonne à l'autre
    const moveGame = (gameId: number, newStatus: Game['status']) => {
        setGames(prevGames =>
            prevGames.map(game =>
                game.id === gameId ? { ...game, status: newStatus } : game
            )
        );
    };

    // Filtrer les jeux par statut
    const backlog = games.filter(game => game.status === 'A faire');
    const inProgress = games.filter(game => game.status === 'En cours');
    const completed = games.filter(game => game.status === 'Termine');
    const platinum = games.filter(game => game.status === 'Platine');

    return (
        <div className="gameBacklog-board">
            <BacklogColumn title="À faire" status="A faire" games={backlog} onMoveGame={moveGame} />
            <BacklogColumn title="En cours" status="En cours" games={inProgress} onMoveGame={moveGame} />
            <BacklogColumn title="Terminé" status="Termine" games={completed} onMoveGame={moveGame} />
            <BacklogColumn title="Platiné" status="Platine" games={platinum} onMoveGame={moveGame} />
        </div>
    );
}