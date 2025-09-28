import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  
  return {
    plugins: [react()],
    define: {
      // Exposer la variable d'environnement
      'import.meta.env.VITE_RAWG_API_KEY': JSON.stringify(env.VITE_RAWG_API_KEY),
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://api.rawg.io',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        },
      },
    },
  }
})
