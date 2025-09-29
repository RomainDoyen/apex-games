import React, { useState, useEffect } from 'react';
import Header from "../components/ui/Header";
import AddGameForm from "../components/ui/AddGameForm";
import "../styles/pages/Admin.css";
import type { AddGameFormData, User } from "../types/types";

export default function Admin() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Simulation de vérification du rôle admin
    useEffect(() => {
        // TODO: Remplacer par la vraie logique d'authentification
        const checkAdminRole = () => {
            // Pour l'instant, on simule un utilisateur admin
            // Dans la vraie implémentation, cela viendra du contexte d'authentification
            const mockUser: User = {
                id: 1,
                username: 'admin',
                email: 'admin@apexgames.com',
                role: 'admin'
            };
            
            setUser(mockUser);
            setIsLoading(false);
        };

        checkAdminRole();
    }, []);

    const handleAddGame = (gameData: AddGameFormData) => {
        // TODO: Implémenter l'appel API pour ajouter le jeu
        console.log('Données du jeu à ajouter:', gameData);
        
        // Simulation d'un ajout réussi
        setSuccessMessage('Jeu ajouté avec succès !');
        setShowAddForm(false);
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
    };

    if (isLoading) {
        return (
            <div className="admin-container">
                <div className="loading-message">
                    <p>Vérification des permissions...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return (
            <div className="admin-container">
                <Header />
                <div className="access-denied">
                    <h2>Accès refusé</h2>
                    <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
                    <button 
                        className="back-btn"
                        onClick={() => window.history.back()}
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <Header />
            
            <div className="admin-content">
                <div className="admin-header">
                    <button 
                        className="back-to-home-btn"
                        onClick={() => window.location.href = '/'}
                    >
                        ← Retour à l'accueil
                    </button>
                    <h1>Administration</h1>
                    <p>Gérez les jeux de la plateforme</p>
                </div>

                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}

                <div className="admin-actions">
                    <button 
                        className="add-game-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        + Ajouter un nouveau jeu
                    </button>
                </div>

                {showAddForm && (
                    <AddGameForm 
                        onSubmit={handleAddGame}
                        onCancel={handleCancelAdd}
                    />
                )}

                <div className="admin-stats">
                    <div className="stat-card">
                        <h3>Jeux en base</h3>
                        <p className="stat-number">1,247</p>
                    </div>
                    <div className="stat-card">
                        <h3>Utilisateurs actifs</h3>
                        <p className="stat-number">892</p>
                    </div>
                    <div className="stat-card">
                        <h3>Jeux ajoutés ce mois</h3>
                        <p className="stat-number">23</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
