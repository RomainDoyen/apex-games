import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { axiosInstanceBackend } from '../api/Instances';
import '../styles/pages/Admin.css';

interface AdminStats {
  totalUsers: number;
  totalGames: number;
  totalBacklogs: number;
}

export default function Admin() {
  const { user, isAdmin, isModerator } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstanceBackend.get('/admin/dashboard');
        setStats(response.data.stats);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des données admin');
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin()) {
      fetchAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin() && !isModerator()) {
    return (
      <div className="admin-page">
        <Header />
        <main className="admin-main">
          <div className="access-denied">
            <h1>Accès refusé</h1>
            <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-header">
            <h1>Tableau de bord administrateur</h1>
            <p>Bienvenue, {user?.username} ({user?.role})</p>
          </div>

          {loading && (
            <div className="loading">
              <p>Chargement des données...</p>
            </div>
          )}

          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}

          {stats && (
            <div className="admin-stats">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Utilisateurs</h3>
                  <p className="stat-number">{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                  <h3>Jeux</h3>
                  <p className="stat-number">{stats.totalGames}</p>
                </div>
                <div className="stat-card">
                  <h3>Backlogs</h3>
                  <p className="stat-number">{stats.totalBacklogs}</p>
                </div>
              </div>
            </div>
          )}

          <div className="admin-actions">
            <h2>Actions administrateur</h2>
            <div className="actions-grid">
              {isAdmin() && (
                <>
                  <button className="action-btn">
                    Gérer les utilisateurs
                  </button>
                  <button className="action-btn">
                    Statistiques avancées
                  </button>
                  <button className="action-btn">
                    Configuration système
                  </button>
                </>
              )}
              {isModerator() && (
                <>
                  <button className="action-btn">
                    Modération des contenus
                  </button>
                  <button className="action-btn">
                    Rapports utilisateurs
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
