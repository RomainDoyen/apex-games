import { getAllGames } from "../../api/Services";
import { useState, useEffect, useCallback } from "react";
import type { Game } from "../../types/types";
import Spinner from "./Spinner";
import GameCard from "./Card";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";
import "../../styles/components/AllGames.css";
import Filter from "./Filter";

export default function AllGames() {

    const [allGames, setAllGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchFilter, setSearchFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [allGamesData, setAllGamesData] = useState<Game[]>([]);
    const gamesPerPage = 12; // 6 colonnes × 2 lignes

    // Debounce pour la recherche
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchFilter);
        }, 500); // Délai de 500ms

        return () => clearTimeout(timer);
    }, [searchFilter]);

    // Fonction de récupération des jeux (une seule fois au chargement)
    const fetchAllGames = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllGames("rawg/games");
            setAllGamesData(data.results);
        } catch (err) {
            console.error("Erreur lors du chargement des jeux:", err);
            setError("Erreur lors du chargement des jeux");
            setAllGamesData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Chargement initial des jeux
    useEffect(() => {
        fetchAllGames();
    }, [fetchAllGames]);

    // Filtrage côté client
    useEffect(() => {
        let filteredGames = [...allGamesData];

        // Filtrage par recherche
        if (debouncedSearch) {
            filteredGames = filteredGames.filter(game => 
                game.name.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        // Filtrage par catégorie (tri)
        if (categoryFilter && categoryFilter !== "all") {
            switch (categoryFilter) {
                case "Popularité":
                    filteredGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    break;
                case "Titre du jeu":
                    filteredGames.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case "Tendance":
                    filteredGames.sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));
                    break;
                case "Date de sortie":
                    filteredGames.sort((a, b) => new Date(b.released || '').getTime() - new Date(a.released || '').getTime());
                    break;
                case "Les mieux notés":
                    filteredGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    break;
                default:
                    break;
            }
        }

        setAllGames(filteredGames);
        setTotalPages(Math.ceil(filteredGames.length / gamesPerPage));
    }, [allGamesData, debouncedSearch, categoryFilter, gamesPerPage]);

    // Calculer les jeux à afficher pour la page courante
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    const currentGames = allGames.slice(startIndex, endIndex);

    // Fonction de changement de page
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = useCallback((search: string) => {
        setCurrentPage(1);
        setSearchFilter(search);
    }, []);

    const handleCategoryChange = useCallback((category: string) => {
        setCurrentPage(1);
        setCategoryFilter(category);
    }, []);

    if (loading) {
        return (
            <div className="all-games-container">
                <div className="loading-container">
                    <Spinner size="large" color="#008AC0" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="all-games-container">
            <div className="all-games-header">
                <h1>{allGames.length} Jeux</h1>
                <Filter 
                    placeholder="Rechercher" 
                    options={["Popularité", "Titre du jeu", "Tendance", "Date de sortie", "Les mieux notés"]} 
                    onSearchChange={handleSearchChange}
                    onCategoryChange={handleCategoryChange}
                    searchValue={searchFilter}
                    categoryValue={categoryFilter}
                />
            </div>
            
            {allGames.length === 0 ? (
                <div className="no-games-message">
                    <h2>Aucun jeu trouvé</h2>
                    <p>Essayez de modifier vos critères de recherche</p>
                </div>
            ) : (
                <>
                    <div className="all-games">
                        {currentGames.map((game) => (
                            <div key={game.id}>
                                <Link to={`/games/${game.id}`}>
                                    <GameCard 
                                        title={game.name} 
                                        image={game.background_image || ""} 
                                        game={game}
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="all-games-footer">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}
        </div>
    )
}