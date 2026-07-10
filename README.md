# Moulti Game

Moulti Game est une application web fullstack qui regroupe plusieurs mini-jeux dans une même interface. Le projet permet à un utilisateur de créer un compte, jouer, enregistrer ses scores, consulter son historique et obtenir un résumé intelligent de ses performances grâce à une fonctionnalité IA.

## Aperçu

Mini-jeux actuellement disponibles :

- Snake
- Simon
- Pendu
- Devine Nombre
- Puissance 4

Fonctionnalités principales :

- inscription et connexion utilisateur ;
- authentification par JWT ;
- enregistrement des scores en base PostgreSQL ;
- historique des parties avec filtrage par jeu ;
- suppression de l'historique global ou ciblé ;
- résumé IA des performances à partir des scores du joueur.

## Stack technique

- Frontend : HTML, CSS, JavaScript vanilla
- Backend : Node.js, Express
- Base de données : PostgreSQL
- Authentification : JWT
- IA : OpenAI `gpt-4o-mini` par défaut
- Exécution locale : Docker Compose

## Architecture du projet

```text
frontend/   Interface utilisateur, pages et logique des mini-jeux
backend/    API REST, authentification, services metier
database/   Schema SQL et seed
docs/       Documentation projet
```

Le frontend appelle le backend via des requêtes HTTP. Le backend gère l'authentification, les scores, l'accès à PostgreSQL et l'appel à l'API OpenAI pour la synthèse des performances.

## Lancer le projet

### Prérequis

- Docker
- Docker Compose

### Démarrage

Depuis la racine du projet :

```powershell
docker compose up --build
```

Une fois les conteneurs lancés :

- application : `http://localhost:3000`
- vérification backend : `http://localhost:3000/health`

## Variables d’environnement

Le `docker-compose.yml` prévoit déjà les variables principales du backend.

Variables utiles :

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@db:5432/moulti_game
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=2h
PGSSL=false
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

La fonctionnalité IA nécessite une clé OpenAI valide dans `OPENAI_API_KEY`.

## Parcours utilisateur

1. Arriver sur la page d'accueil.
2. Créer un compte ou se connecter.
3. Accéder au menu principal.
4. Choisir un mini-jeu.
5. Jouer dans le navigateur.
6. Enregistrer le score en base.
7. Consulter l'historique des scores.
8. Générer un résumé IA des performances.

## API principale

### Authentification

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Scores

- `POST /api/scores`
- `GET /api/scores/games`
- `GET /api/scores/history`
- `DELETE /api/scores/history`

### IA

- `GET /api/insights/performance-summary`

### Santé du service

- `GET /health`

## Fonctionnalité IA

Le projet intègre une fonctionnalité IA réellement implémentée côté backend. À partir de l'historique des scores du joueur, le serveur calcule plusieurs statistiques, puis envoie un prompt à l'API OpenAI pour générer une synthèse exploitable par le frontend.

La réponse contient notamment :

- `overview`
- `strengths`
- `focusPoints`
- `recommendedGame`
- `recommendationReason`
- `nextGoal`

Cette fonctionnalité permet d'aller au-delà d'un simple affichage de scores en proposant un retour personnalisé sur la progression du joueur.

## Base de données

Le projet repose sur deux tables principales :

- `players`
- `player_scores`

Le schema SQL est disponible dans [database/schema.sql](/C:/Users/julia/OneDrive/Documents/Ecole/Ynov/Matser_2/moulti-game/database/schema.sql).

## Structure fonctionnelle

```text
Accueil
|- Connexion
|- Inscription
`- Menu joueur
   |- Snake
   |- Simon
   |- Pendu
   |- Devine Nombre
   |- Puissance 4
   `- Historique des scores
```

## Limites actuelles

- pas de déploiement en production ;
- pas de mode multijoueur ;
- pas de classement global ;
- dépendance à une clé OpenAI pour la fonctionnalité IA.

## Documentation complémentaire

- Document de cadrage : [docs/document-cadrage.md](/C:/Users/julia/OneDrive/Documents/Ecole/Ynov/Matser_2/moulti-game/docs/document-cadrage.md)
- Architecture : [docs/architecture.md](/C:/Users/julia/OneDrive/Documents/Ecole/Ynov/Matser_2/moulti-game/docs/architecture.md)
- Intention projet : [docs/intention.md](/C:/Users/julia/OneDrive/Documents/Ecole/Ynov/Matser_2/moulti-game/docs/intention.md)

## Dépôt

Dépôt GitHub : `https://github.com/Angelina974/moulti-game`
