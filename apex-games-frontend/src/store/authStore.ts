import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstanceBackend } from '../api/Instances';

export type UserRole = 'admin' | 'user' | 'moderator';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  
  // Helpers pour les rôles
  isAdmin: () => boolean;
  isModerator: () => boolean;
  hasRole: (role: UserRole) => boolean;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await axiosInstanceBackend.post('/auth/login', {
            email,
            password,
          });

          const { user, access_token } = response.data;
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Configurer le token dans Axios pour les futures requêtes
          axiosInstanceBackend.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erreur de connexion';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await axiosInstanceBackend.post('/auth/register', {
            username,
            email,
            password,
          });

          // Inscription réussie, pas de connexion automatique
          
          // Ne pas connecter automatiquement après inscription
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          // L'utilisateur devra se connecter manuellement
          
        } catch (error: unknown) {
          const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erreur d\'inscription';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        // Supprimer le token des headers Axios
        delete axiosInstanceBackend.defaults.headers.common['Authorization'];
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        const { token } = get();
        
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          // Configurer le token pour cette requête
          axiosInstanceBackend.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await axiosInstanceBackend.get('/auth/verify');
          
          if (response.data.valid) {
            set({
              isAuthenticated: true,
              user: response.data.user,
            });
          } else {
            set({
              isAuthenticated: false,
              user: null,
              token: null,
            });
          }
        } catch {
          // Token invalide ou expiré
          set({
            isAuthenticated: false,
            user: null,
            token: null,
          });
          delete axiosInstanceBackend.defaults.headers.common['Authorization'];
        }
      },

      // Helpers pour les rôles
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      isModerator: () => {
        const { user } = get();
        return user?.role === 'moderator' || user?.role === 'admin';
      },

      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
