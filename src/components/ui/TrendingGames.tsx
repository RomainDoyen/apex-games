import "../../styles/components/TrendingGames.css"
import GameCard from "./Card"
import { getAll } from "../../api/Services";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import type { Game } from "../../types/types";

export default function TrendingGames() {
    const [trendingGames, setTrendingGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrendingGames = async () => {
            try {
                setLoading(true);
                const data = await getAll("/games");
                // RAWG API retourne les jeux dans data.results
                if (data && data.results) {
                    setTrendingGames(data.results);
                } else {
                    setTrendingGames([]);
                }
            } catch (err) {
                console.error("Erreur lors du chargement des jeux:", err);
                setError("Erreur lors du chargement des jeux");
                setTrendingGames([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingGames();
    }, []);

    if (loading) {
        return (
            <div className="trending-games">
                <div className="trending-header">
                    <h2>Tendances récentes</h2>
                    <a href="/trending" className="see-more-link">Voir plus</a>
                </div>
                <div className="trending-cards trending-cards-loading">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="trending-games">
                <div className="trending-header">
                    <h2>Tendances récentes</h2>
                    <a href="/trending" className="see-more-link">Voir plus</a>
                </div>
                <div className="trending-cards">
                    <div style={{ 
                        padding: '20px', 
                        textAlign: 'center', 
                        color: '#666',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                    }}>
                        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                            ⚠️ Erreur de configuration
                        </p>
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                            {error.includes('Clé API RAWG manquante') 
                                ? 'Clé API manquante. Vérifiez votre fichier .env'
                                : error
                            }
                        </p>
                        <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
                            Vérifiez la console pour plus de détails
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="trending-games">
            <div className="trending-header">
                <h2>Tendances récentes</h2>
                <a href="/trending" className="see-more-link">Voir plus</a>
            </div>
            <div className="trending-cards">
                {trendingGames && trendingGames.length > 0 ? (
                    trendingGames.slice(0, 6).map((game) => (
                        <GameCard 
                            key={game.id}
                            title={game.name}
                            image={game.background_image}
                        />
                    ))
                ) : (
                    <p>Aucun jeu trouvé</p>
                )}
            </div>
        </div>
    )
}
