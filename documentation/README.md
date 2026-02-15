# Documentation — Apex Games

Cette documentation est un mini-site **statique** (HTML/CSS/JS) conçu pour rester :
- **simple** (pas d’outil de build),
- **accessible** (focus visible, contrastes élevés, navigation clavier),
- **maintenable** (structure claire, pages courtes).

Elle décrit l’architecture, les fonctionnalités et les choix techniques du projet **Apex Games** (plateforme de découverte de jeux vidéo).

## Ouvrir la documentation

Ouvrir `documentation/index.html` dans un navigateur.

## Structure

```
documentation/
├── index.html
├── README.md                 (ce fichier)
├── assets/
│   ├── styles.css
│   └── app.js
├── accessibility/
│   ├── guidelines.html
│   └── audit-reports.html
├── architecture/
│   ├── overview.html
│   └── data-flow.html
├── features/
│   ├── decouverte.html       (catalogue, filtres, RAWG)
│   ├── backlog.html          (Kanban, colonnes)
│   ├── auth.html             (connexion, inscription)
│   ├── favoris.html          (sauvegarde des jeux préférés)
│   └── api-endpoints.html    (API RAWG + backend NestJS)
└── donnees/
    ├── donnees.html          (Supabase + RAWG, vue d’ensemble + BDD)
    └── bdd.md                (référence schéma / tables Supabase)
```

## Règle de contribution

- Toute modification significative (nouvelle feature, changement d’architecture, API) doit mettre à jour la page concernée dans `architecture/` ou `features/`.
- Les évolutions liées à l’accessibilité peuvent être tracées dans `accessibility/audit-reports.html`.
