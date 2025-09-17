import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getById } from "../api/Services";
import type { Game } from "../types/types";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import Spinner from "../components/ui/Spinner";
import BookmarkButton from "../components/ui/BookmarkButton";
import Image from "../components/ui/Image";
import { formatGameDescription, isFrenchText, translateGameDescription } from "../utils/translation";
import "../styles/pages/GameDetails.css";

export default function GameDetails() {
    const { id } = useParams<{ id: string }>();
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [translatedDescription, setTranslatedDescription] = useState<string>("");
    const [translating, setTranslating] = useState(false);

    useEffect(() => {
        const fetchGameDetails = async () => {
            if (!id) {
                setError("ID du jeu manquant");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getById("/games", id);
                setGame(data);
            } catch (err) {
                console.error("Erreur lors du chargement des détails du jeu:", err);
                setError("Erreur lors du chargement des détails du jeu");
            } finally {
                setLoading(false);
            }
        };

        fetchGameDetails();
    }, [id]);

    // Traduire la description quand le jeu est chargé
    useEffect(() => {
        const translateDescription = async () => {
            if (!game) return;
            
            const rawDescription = game.description_raw || game.description || '';
            if (!rawDescription) return;
            
            setTranslating(true);
            try {
                const translated = await translateGameDescription(rawDescription);
                setTranslatedDescription(translated);
            } catch (error) {
                console.error('Erreur lors de la traduction:', error);
                setTranslatedDescription(formatGameDescription(rawDescription));
            } finally {
                setTranslating(false);
            }
        };

        translateDescription();
    }, [game]);

    if (loading) {
        return (
            <div className="game-details-container">
                <Header />
                <div className="loading-container">
                    <Spinner size="large" color="#008AC0" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="game-details-container">
                <Header />
                <div className="error-container">
                    <h2>Erreur</h2>
                    <p>{error || "Jeu non trouvé"}</p>
                    <Link to="/games" className="back-button">
                        Retour aux jeux
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Date inconnue";
        return new Date(dateString).toLocaleDateString("fr-FR");
    };

    const formatPlaytime = (playtime?: number) => {
        if (!playtime) return "Non spécifié";
        if (playtime < 60) return `${playtime} minutes`;
        const hours = Math.floor(playtime / 60);
        const minutes = playtime % 60;
        return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    };

    return (
        <div className="game-details-container">
            <Header />
            
            <div className="game-details-content">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Accueil</Link>
                    <span> / </span>
                    <Link to="/games">Jeux</Link>
                    <span> / </span>
                    <span>{game.name}</span>
                </nav>

                {/* Hero Section */}
                <div className="game-hero">
                    <div className="game-hero-image">
                        <Image 
                            src={game.background_image || ""} 
                            alt={game.name}
                            className="hero-bg"
                        />
                        <div className="hero-overlay">
                            <div className="hero-content">
                                <h1 className="game-title">{game.name}</h1>
                                <div className="game-meta">
                                    {game.released && (
                                        <span className="release-date">
                                            Sorti le {formatDate(game.released)}
                                        </span>
                                    )}
                                    {game.rating && (
                                        <span className="rating">
                                            ⭐ {game.rating.toFixed(1)}/5
                                        </span>
                                    )}
                                    {game.metacritic && (
                                        <span className="metacritic">
                                            Metacritic: {game.metacritic}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="hero-actions">
                                <BookmarkButton game={game} size="large" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Game Info Layout */}
                <div className="game-info-layout">
                    {/* Left Column - Game Details */}
                    <div className="game-info-left">
                        {/* Game Details */}
                        <div className="info-section">
                            <h2>Détails du jeu</h2>
                            <div className="game-details-list">
                                {game.playtime && (
                                    <div className="detail-item">
                                        <strong>Temps de jeu moyen:</strong>
                                        <span>{formatPlaytime(game.playtime)}</span>
                                    </div>
                                )}
                                {game.rating_count && (
                                    <div className="detail-item">
                                        <strong>Nombre d'évaluations:</strong>
                                        <span>{game.rating_count.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Platforms */}
                        {game.platforms && game.platforms.length > 0 && (
                            <div className="info-section">
                                <h2>Plateformes</h2>
                                <div className="platforms">
                                    {game.platforms.map((platform) => (
                                        <span key={platform.platform.id} className="platform-tag">
                                            {platform.platform.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Genres */}
                        {game.genres && game.genres.length > 0 && (
                            <div className="info-section">
                                <h2>Genres</h2>
                                <div className="genres">
                                    {game.genres.map((genre) => (
                                        <span key={genre.id} className="genre-tag">
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Developers */}
                        {game.developers && game.developers.length > 0 && (
                            <div className="info-section">
                                <h2>Développeurs</h2>
                                <div className="developers">
                                    {game.developers.map((developer) => (
                                        <span key={developer.id} className="developer-tag">
                                            {developer.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Publishers */}
                        {game.publishers && game.publishers.length > 0 && (
                            <div className="info-section">
                                <h2>Éditeurs</h2>
                                <div className="publishers">
                                    {game.publishers.map((publisher) => (
                                        <span key={publisher.id} className="publisher-tag">
                                            {publisher.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Links */}
                        <div className="info-section">
                            <h2>Liens utiles</h2>
                            <div className="game-links">
                                {game.website && (
                                    <a 
                                        href={game.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="link-button"
                                    >
                                        Site officiel
                                    </a>
                                )}
                                {game.reddit_url && (
                                    <a 
                                        href={game.reddit_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="link-button"
                                    >
                                        Reddit
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Description */}
                    <div className="game-info-right">
                        <div className="info-section description-section">
                            <h2>Description</h2>
                            <div className="description">
                                {translating ? (
                                    <div className="translating-indicator">
                                        <Spinner size="small" color="#008AC0" />
                                        <span>Traduction en cours...</span>
                                    </div>
                                ) : (
                                    <div>
                                        <p>{translatedDescription || 'Aucune description disponible.'}</p>
                                        {translatedDescription && !isFrenchText(translatedDescription) && (
                                            <div className="language-notice">
                                                <small>
                                                    <em>Traduit automatiquement en français</em>
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Screenshots */}
                {game.short_screenshots && game.short_screenshots.length > 0 && (
                    <div className="screenshots-section">
                        <h2>Captures d'écran</h2>
                        <div className="screenshots-grid">
                            {game.short_screenshots.slice(0, 6).map((screenshot) => (
                                <div key={screenshot.id} className="screenshot-item">
                                    <Image 
                                        src={screenshot.image} 
                                        alt={`Screenshot de ${game.name}`}
                                        className="screenshot-image"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back Button */}
                <div className="back-section">
                    <Link to="/games" className="back-button">
                        ← Retour à la liste des jeux
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}