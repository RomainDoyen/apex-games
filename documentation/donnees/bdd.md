# Base de données — Apex Games

**Dernière mise à jour : 2026-02-15**

La persistance des données utilisateur est gérée par **Supabase**. Il n’y a pas de fichier SQL dans le dépôt : le schéma se crée et s’évolution dans le projet Supabase (dashboard ou migrations).

## Rôle de la BDD

- **Authentification** : Supabase Auth (utilisateurs, sessions, reset password). Aucune table à documenter ici.
- **Backlog** : les jeux ajoutés au backlog par chaque utilisateur, avec un statut (à jouer, en cours, terminé). Les colonnes et noms de tables dépendent de l’implémentation backend (BacklogModule → Supabase).
- **Optionnel** : cache de jeux RAWG, préférences utilisateur, etc. — à documenter ici si ajouté.

## Où documenter le schéma

Quand les tables Supabase sont définies (backlog, etc.) :

1. Décrire dans ce fichier les **tables** (nom, colonnes principales, lien avec l’auth).
2. Mentionner les **politiques RLS** (Row Level Security) si importantes pour la compréhension.
3. Mettre à jour la page [donnees.html](donnees.html) si la vue d’ensemble change.

## Exemple (à adapter)

```text
Table backlog (ou backlog_games)
- id (uuid, PK)
- user_id (uuid, FK → auth.users)
- rawg_id (int) — ID du jeu RAWG
- status (text) — ex. 'to-play' | 'in-progress' | 'completed'
- title, image (text, optionnel)
- created_at, updated_at (timestamptz)
```

Remplacer par le schéma réel une fois les tables créées dans Supabase.
