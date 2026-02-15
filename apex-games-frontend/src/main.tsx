import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Games from './pages/Games.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Backlog from './pages/GameBacklog.tsx'
import GameDetails from './pages/GameDetails.tsx'
import TestApi from './pages/TestApi.tsx'
import Admin from './pages/Admin.tsx'
import ForgotPassword from './pages/ForgotPassword.tsx'
import ResetPassword from './pages/ResetPassword.tsx'
import Settings from './pages/Settings.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import RoleProtectedRoute from './components/RoleProtectedRoute.tsx'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

function AppWithAuth() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/games" element={<Games />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/games/:id" element={<GameDetails />} />
        
        {/* Routes protégées */}
        <Route path="/backlog" element={
          <ProtectedRoute>
            <Backlog />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/test-api" element={
          <ProtectedRoute>
            <TestApi />
          </ProtectedRoute>
        } />
        
        {/* Routes protégées par rôle */}
        <Route path="/admin" element={
          <RoleProtectedRoute allowedRoles={['admin', 'moderator']}>
            <Admin />
          </RoleProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<AppWithAuth />)
