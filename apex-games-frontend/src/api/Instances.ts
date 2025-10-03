import axios from 'axios';
import { config } from '../config/env';

// Configuration de l'instance axios
const axiosInstance = axios.create({
    baseURL: 'https://api.rawg.io/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Connexion au backend
const axiosInstanceBackend = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter la clé API et les paramètres de localisation à chaque requête
axiosInstance.interceptors.request.use(
    (requestConfig) => {
        // Vérifier si la clé API est disponible
        if (!requestConfig.params) {
            requestConfig.params = {};
        }
        
        if (config.RAWG_API_KEY) {
            requestConfig.params.key = config.RAWG_API_KEY;
        } else {
            throw new Error("Clé API RAWG manquante. Vérifiez votre fichier .env");
        }
        
        // Ajouter les paramètres de localisation française
        requestConfig.params.language = 'fr';
        requestConfig.params.region = 'fr';
        
        return requestConfig;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour ajouter la clé API et les paramètres de localisation à chaque requête
axiosInstanceBackend.interceptors.request.use(
    (requestConfig) => {
        return requestConfig;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export { axiosInstance, axiosInstanceBackend };