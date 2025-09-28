<div align="center">
  <img src="apex-games-frontend/src/assets/images/logo-apex.png" alt="Apex Games Logo" width="200">
</div>

# 🎮 Game Discovery Landing Page

Une landing page moderne et responsive pour découvrir et explorer des jeux vidéo, intégrée avec l'API RAWG pour afficher les jeux tendances.

## ✨ Fonctionnalités

- **Interface moderne** avec design sombre et animations fluides
- **Intégration RAWG API** pour récupérer les jeux tendances en temps réel
- **Design responsive** adapté à tous les écrans
- **Composants réutilisables** avec TypeScript
- **Animations CSS** et effets de hover interactifs
- **Gestion d'état** avec React hooks
- **Loading states** avec spinner personnalisé

## 🚀 Technologies utilisées

- **React 19** - Framework frontend
- **TypeScript** - Typage statique
- **Vite** - Build tool et serveur de développement
- **Axios** - Client HTTP pour les appels API
- **CSS3** - Styles personnalisés avec animations
- **RAWG API** - API de données de jeux vidéo

## 📦 Installation

1. **Cloner le repository**
   ```bash
   git clone <url-du-repo>
   cd landing-page
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   Créer un fichier `.env` à la racine du projet :
   ```env
   VITE_RAWG_API_KEY=votre_cle_api_rawg
   ```
   
   > 💡 **Obtenir une clé API RAWG** : Rendez-vous sur [RAWG.io](https://rawg.io/apidocs) pour créer un compte gratuit et obtenir votre clé API.

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   Rendez-vous sur `http://localhost:5173`

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Compile l'application pour la production
npm run preview      # Prévisualise la build de production

# Qualité du code
npm run lint         # Vérifie le code avec ESLint
```

## 📁 Structure du projet

```
src/
├── api/                 # Services API et configuration
│   ├── Instances.ts     # Configuration Axios
│   └── Services.ts      # Fonctions API
├── components/ui/       # Composants réutilisables
│   ├── BannerWelcome.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Header.tsx
│   ├── Spinner.tsx
│   └── TrendingGames.tsx
├── config/              # Configuration
│   └── env.ts          # Variables d'environnement
├── pages/               # Pages de l'application
│   └── Home.tsx
├── styles/              # Fichiers CSS
│   ├── BannerWelcome.css
│   ├── Card.css
│   ├── Home.css
│   └── TrendingGames.css
├── types/               # Définitions TypeScript
│   └── types.ts
└── main.tsx            # Point d'entrée
```

## 🎨 Composants principaux

### BannerWelcome
- Section d'accueil avec titre et métriques
- Compteurs animés (Played, Games, Ratings, Reviews, Lists)
- Bouton d'action principal

### TrendingGames
- Affichage des jeux tendances via l'API RAWG
- Grid responsive (6 colonnes sur desktop, adaptatif sur mobile)
- Gestion des états de chargement et d'erreur

### Card
- Composant de carte pour les jeux
- Effets de hover avec opacité et centrage du titre
- Design moderne avec bordures arrondies

## 🔧 Configuration

### Variables d'environnement
- `VITE_RAWG_API_KEY` : Clé API RAWG (obligatoire)

### Proxy API
Le projet utilise un proxy Vite pour contourner les restrictions CORS :
```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://api.rawg.io',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, '/api')
    }
  }
}
```

## 🎯 Fonctionnalités détaillées

### Design responsive
- **Desktop** : 6 cartes par ligne
- **Tablet** : 3-4 cartes par ligne
- **Mobile** : 2 cartes par ligne

### Animations
- Effets de hover sur les cartes
- Transitions fluides
- Spinner de chargement personnalisé

### Gestion d'erreurs
- Affichage d'erreurs API avec messages explicites
- Fallback en cas de clé API manquante
- États de chargement avec spinner centré

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Prévisualisation
```bash
npm run preview
```

Les fichiers de production seront générés dans le dossier `dist/`.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 🔗 Liens utiles

- [Documentation RAWG API](https://rawg.io/apidocs)
- [Documentation React](https://react.dev/)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/)

---

**Développé avec ❤️ en React + TypeScript**
