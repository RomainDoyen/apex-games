<div align="center">
  <img src="apex-games-frontend/src/assets/images/logo-apex.png" alt="Apex Games Logo" width="200">
</div>

# 🎮 Apex Games - Game Discovery Platform

Une plateforme pour découvrir, explorer et gérer votre collection de jeux vidéo, avec intégration **RAWG API**, backlog Kanban et authentification.

## ✨ Fonctionnalités

- **Page d'accueil** — Jeux tendances, design sombre, responsive
- **Découverte** — Catalogue, filtres, pagination, détails par jeu
- **Favoris** — Sauvegarde des jeux préférés (Zustand + localStorage)
- **Backlog Kanban** — Colonnes (À jouer, En cours, Terminé), drag & drop
- **Authentification** — Connexion, inscription, profil (Supabase)

## 🚀 Démarrage rapide

**Prérequis :** Node.js 18+, clé API RAWG ([RAWG.io](https://rawg.io/apidocs))

```bash
# Backend
cd apex-games-backend && npm install && npm run start:dev

# Frontend (autre terminal)
cd apex-games-frontend && npm install
```

Créer `apex-games-frontend/.env` avec `VITE_RAWG_API_KEY=votre_cle`. Puis :

```bash
cd apex-games-frontend && npm run dev
```

→ Application sur `http://localhost:5173`

## 📁 Structure

```
apex-games/
├── apex-games-frontend/   # React 19 + Vite
├── apex-games-backend/    # NestJS (auth, backlog, RAWG, Supabase)
├── documentation/         # Documentation technique (voir ci-dessous)
└── README.md
```

## 📖 Documentation

Toute la documentation technique (architecture, flux de données, features, API, accessibilité) est dans le dossier **`documentation/`**.

- **Ouvrir la doc :** ouvrir `documentation/index.html` dans un navigateur.
- **Contenu :** overview architecture, flux Frontend ↔ Backend ↔ RAWG, découverte / backlog / auth / favoris, endpoints API, données (Supabase & RAWG), accessibilité.

Voir aussi [documentation/README.md](documentation/README.md) pour la structure des pages.

## 🔗 Liens utiles

- [Documentation RAWG API](https://rawg.io/apidocs)
- [React](https://react.dev/) · [NestJS](https://nestjs.com/) · [Vite](https://vitejs.dev/)
