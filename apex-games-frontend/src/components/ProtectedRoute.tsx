import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/components/ProtectedRoute.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion en sauvegardant l'URL actuelle
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
