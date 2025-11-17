import { useState, useEffect } from 'react';
import { getAllGames, addGameToBacklog, patchGame, deleteGame, getAll } from '../api/Services';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import '../styles/pages/TestApi.css';

interface BacklogGame {
    rawg_id: number;
    status: string;
    game: {
        name: string;
        image_url: string;
        metacritic_score: number;
    };
}

interface RawgGame {
    id: number;
    name: string;
    background_image: string;
    metacritic: number;
    released: string;
}

export default function TestApi() {
    const [backlogGames, setBacklogGames] = useState<BacklogGame[]>([]);
    const [availableGames, setAvailableGames] = useState<RawgGame[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingGames, setIsLoadingGames] = useState(false);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Formulaire d'ajout
    const [rawgId, setRawgId] = useState<string>('');
    const [selectedGame, setSelectedGame] = useState<RawgGame | null>(null);
    const [status, setStatus] = useState<string>('A_FAIRE');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Statuts disponibles
    const statuses = ['A_FAIRE', 'EN_COURS', 'TERMINE', 'PLATINE'];

    // Test de connexion et récupération des données
    const fetchBacklog = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await getAllGames('/backlog');
            setBacklogGames(data);
            setIsConnected(true);
            setSuccessMessage('✅ Connexion au backend réussie!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setIsConnected(false);
            setError(`❌ Erreur de connexion: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Ajouter un jeu
    const handleAddGame = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!rawgId) {
            setError('⚠️ Veuillez entrer un ID RAWG');
            return;
        }

        setIsLoading(true);
        try {
            await addGameToBacklog('/backlog', {
            gameId: rawgId as unknown as number,
            status: "aFaire",       
            title: "test",
            gameImage: "test",
        });
            setSuccessMessage(`✅ Jeu #${rawgId} ajouté avec succès!`);
            setRawgId('');
            fetchBacklog();
        } catch (err: unknown) {
            // Gestion spécifique des erreurs 409 (Conflict)
            const error = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
            if (error.response?.status === 409) {
                setError(`⚠️ Ce jeu est déjà dans votre backlog! Utilisez les boutons de statut pour le modifier.`);
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue';
                setError(`❌ Erreur lors de l'ajout: ${errorMessage}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Modifier le statut d'un jeu
    const handleUpdateStatus = async (rawgIdToUpdate: number, newStatus: string) => {
        setError('');
        setSuccessMessage('');
        setIsLoading(true);
        try {
            await patchGame(`/backlog/${rawgIdToUpdate}/status`, { newStatus });
            setSuccessMessage(`✅ Statut mis à jour: ${newStatus}`);
            fetchBacklog();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue';
            setError(`❌ Erreur lors de la mise à jour: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Supprimer un jeu
    const handleDeleteGame = async (rawgIdToDelete: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce jeu du backlog?')) {
            return;
        }

        setError('');
        setSuccessMessage('');
        setIsLoading(true);
        try {
            await deleteGame('/backlog', rawgIdToDelete.toString());
            setSuccessMessage(`✅ Jeu #${rawgIdToDelete} supprimé!`);
            fetchBacklog();
        } catch (err) {
            setError(`❌ Erreur lors de la suppression: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Récupérer les jeux populaires depuis RAWG
    const fetchAvailableGames = async (search: string = '') => {
        setIsLoadingGames(true);
        try {
            const params = search 
                ? `games?search=${encodeURIComponent(search)}&page_size=20`
                : 'games?ordering=-metacritic&page_size=30';
            const response = await getAll(params);
            setAvailableGames(response.results || []);
        } catch (err) {
            console.error('Erreur lors de la récupération des jeux:', err);
        } finally {
            setIsLoadingGames(false);
        }
    };

    // Sélectionner un jeu
    const handleSelectGame = (game: RawgGame) => {
        setSelectedGame(game);
        setRawgId(game.id.toString());
    };

    // Recherche de jeux
    const handleSearch = () => {
        if (searchQuery.trim()) {
            fetchAvailableGames(searchQuery);
        } else {
            fetchAvailableGames();
        }
    };

    // Chargement initial
    useEffect(() => {
        fetchBacklog();
        fetchAvailableGames(); // Charger les jeux populaires
    }, []);

    return (
        <div className="testapi-page">
            <Header />
            
            <div className="testapi-container">
                <h1>🧪 Page de Test API Backend</h1>
                
                {/* État de la connexion */}
                <div className={`connection-status ${isConnected === true ? 'connected' : isConnected === false ? 'disconnected' : 'loading'}`}>
                    {isConnected === true && '🟢 Connecté au backend'}
                    {isConnected === false && '🔴 Déconnecté du backend'}
                    {isConnected === null && '⚪ Test en cours...'}
                </div>

                {/* Messages */}
                {successMessage && <div className="message success">{successMessage}</div>}
                {error && <div className="message error">{error}</div>}

                {/* Sélection et ajout de jeu */}
                <div className="testapi-section">
                    <h2>➕ Ajouter un jeu au backlog</h2>
                    
                    {/* Barre de recherche */}
                    <div className="search-bar">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Rechercher un jeu (ex: GTA, Witcher, Elden Ring...)"
                            disabled={isLoadingGames}
                        />
                        <button onClick={handleSearch} className="btn-search" disabled={isLoadingGames}>
                            🔍 Rechercher
                        </button>
                        <button onClick={() => { setSearchQuery(''); fetchAvailableGames(); }} className="btn-search">
                            🔄 Populaires
                        </button>
                    </div>

                    {/* Jeu sélectionné */}
                    {selectedGame && (
                        <div className="selected-game">
                            <img src={selectedGame.background_image} alt={selectedGame.name} />
                            <div className="selected-game-info">
                                <h4>{selectedGame.name}</h4>
                                <p>ID: {selectedGame.id} | Metacritic: {selectedGame.metacritic || 'N/A'}</p>
                            </div>
                            <button onClick={() => { setSelectedGame(null); setRawgId(''); }} className="btn-clear">
                                ✖️ Annuler
                            </button>
                        </div>
                    )}

                    {/* Liste des jeux disponibles */}
                    {!selectedGame && (
                        <div className="available-games">
                            <h3>{searchQuery ? 'Résultats de recherche' : 'Jeux populaires'} ({availableGames.length})</h3>
                            {isLoadingGames ? (
                                <div className="loading">Chargement des jeux...</div>
                            ) : (
                                <div className="games-select-grid">
                                    {availableGames.map((game) => (
                                        <div 
                                            key={game.id} 
                                            className="game-select-card"
                                            onClick={() => handleSelectGame(game)}
                                        >
                                            <img src={game.background_image} alt={game.name} />
                                            <div className="game-select-info">
                                                <h4>{game.name}</h4>
                                                <div className="game-select-meta">
                                                    <span>ID: {game.id}</span>
                                                    {game.metacritic && <span>⭐ {game.metacritic}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Formulaire d'ajout */}
                    <form onSubmit={handleAddGame} className="add-game-form">
                        <div className="form-group">
                            <label htmlFor="status">Statut:</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                disabled={isLoading}
                            >
                                {statuses.map(s => (
                                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn-primary" disabled={isLoading || !rawgId}>
                            {isLoading ? 'Ajout...' : 'Ajouter au backlog'}
                        </button>
                    </form>
                </div>

                {/* Liste des jeux du backlog */}
                <div className="testapi-section">
                    <div className="section-header">
                        <h2>📊 Jeux dans le backlog ({backlogGames.length})</h2>
                        <button onClick={fetchBacklog} className="btn-refresh" disabled={isLoading}>
                            🔄 Rafraîchir
                        </button>
                    </div>

                    {isLoading && <div className="loading">Chargement...</div>}

                    {!isLoading && backlogGames.length === 0 && (
                        <p className="empty-state">Aucun jeu dans le backlog. Ajoutez-en un ci-dessus!</p>
                    )}

                    <div className="games-grid">
                        {backlogGames.map((item) => (
                            <div key={item.rawg_id} className="game-card">
                                <div className="game-image">
                                    <img 
                                        src={item.game.image_url} 
                                        alt={item.game.name}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                                        }}
                                    />
                                </div>
                                <div className="game-info">
                                    <h3>{item.game.name}</h3>
                                    <div className="game-meta">
                                        <span className="rawg-id">ID: {item.rawg_id}</span>
                                        {item.game.metacritic_score && (
                                            <span className="metacritic">⭐ {item.game.metacritic_score}</span>
                                        )}
                                    </div>
                                    <div className={`status-badge status-${item.status.toLowerCase()}`}>
                                        {item.status.replace('_', ' ')}
                                    </div>
                                </div>
                                <div className="game-actions">
                                    <div className="status-buttons">
                                        {statuses.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => handleUpdateStatus(item.rawg_id, s)}
                                                className={`btn-status ${item.status === s ? 'active' : ''}`}
                                                disabled={isLoading || item.status === s}
                                                title={`Changer vers ${s.replace('_', ' ')}`}
                                            >
                                                {s.replace('_', ' ').substring(0, 3)}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteGame(item.rawg_id)}
                                        className="btn-delete"
                                        disabled={isLoading}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Documentation des endpoints */}
                <div className="testapi-section">
                    <h2>📖 Documentation des endpoints</h2>
                    <div className="endpoints-list">
                        <div className="endpoint">
                            <span className="method get">GET</span>
                            <code>/backlog</code>
                            <span className="desc">Récupérer tous les jeux du backlog</span>
                        </div>
                        <div className="endpoint">
                            <span className="method post">POST</span>
                            <code>/backlog</code>
                            <span className="desc">Ajouter un jeu (body: {`{rawgId, status}`})</span>
                        </div>
                        <div className="endpoint">
                            <span className="method patch">PATCH</span>
                            <code>/backlog/:rawgId/status</code>
                            <span className="desc">Modifier le statut (body: {`{newStatus}`})</span>
                        </div>
                        <div className="endpoint">
                            <span className="method delete">DELETE</span>
                            <code>/backlog/:rawgId</code>
                            <span className="desc">Supprimer un jeu du backlog</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
