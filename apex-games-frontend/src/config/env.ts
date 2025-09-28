// Configuration des variables d'environnement Vite
export const config = {
    RAWG_API_KEY: import.meta.env.VITE_RAWG_API_KEY,
    NODE_ENV: import.meta.env.MODE || 'development',
    IS_DEV: import.meta.env.DEV || false,
};

export default config;
