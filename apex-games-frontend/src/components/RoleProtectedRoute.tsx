import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

type UserRole = 'admin' | 'user' | 'moderator';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export default function RoleProtectedRoute({ 
  children, 
  allowedRoles, 
  fallbackPath = '/' 
}: RoleProtectedRouteProps) {
  const { isAuthenticated, user, hasRole } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = allowedRoles.some(role => hasRole(role));

  if (!hasRequiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
