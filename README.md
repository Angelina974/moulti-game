# Moulti Game

Projet fil rouge avec:
- frontend statique (jeux + auth)
- backend Node.js/Express
- API JWT (inscription/connexion/session)
- PostgreSQL pour persister les joueurs

## Demarrage rapide (recommande)

Lance **backend + base de donnees** ensemble:

```powershell
docker compose up --build
```

Ensuite ouvre:

- `http://localhost:3000`

Arreter:

```powershell
docker compose down
```

Reset complet (supprime les donnees Postgres du volume):

```powershell
docker compose down -v
```

## Pourquoi c'est mieux

Tu ne peux pas "embarquer" PostgreSQL dans le process Node directement. La DB est un service separe.
Le standard pour "lancer tout d'un coup" est Docker Compose.

## Fichiers Docker ajoutes

- `docker-compose.yml` (services `db` + `backend`)
- `backend/Dockerfile`
- `backend/.dockerignore`

## Configuration Compose

- PostgreSQL:
  - host interne: `db`
  - db: `moulti_game`
  - user: `postgres`
  - password: `postgres`
  - port local: `5432`
- Backend:
  - port local: `3000`
  - `DATABASE_URL=postgresql://postgres:postgres@db:5432/moulti_game`

Le schema est charge automatiquement au premier demarrage via:

- `database/schema.sql`
- `database/seed.sql`

## Structure

- `frontend/`
- `backend/`
  - `server.js`
  - `src/db.js`
  - `src/services/userStore.js`
  - `src/middleware/auth.js`
  - `src/utils/jwt.js`
  - `src/utils/password.js`
- `database/`
  - `schema.sql`
  - `seed.sql`

## API Auth JWT

### POST `/api/auth/register`

```json
{
  "username": "julia",
  "email": "julia@example.com",
  "password": "secret123"
}
```

### POST `/api/auth/login`

```json
{
  "email": "julia@example.com",
  "password": "secret123"
}
```

### GET `/api/auth/me` (protegee)

Header:

- `Authorization: Bearer <jwt>`

### GET `/api/protected/ping` (protegee)

Header:

- `Authorization: Bearer <jwt>`

## Mode sans Docker (optionnel)

Si tu veux lancer a la main:

1. Demarrer PostgreSQL local
2. Exporter `DATABASE_URL`
3. Dans `backend/`:
   - `npm.cmd install`
   - `npm.cmd start`

## Historique des scores

Page frontend:

- `/pages/scores/history.html`

API scores (JWT requis):

- `POST /api/scores`
  - body: `{ "gameName": "Snake", "scoreValue": 42, "metadata": { "level": 3 } }`
- `GET /api/scores/games`
- `GET /api/scores/history?game=Snake&limit=50`

Remarque: pour alimenter l'historique, chaque jeu doit appeler `POST /api/scores` a la fin d'une partie.

## Enregistrer un score depuis un jeu

Chaque jeu peut envoyer le score final avec:

```js
await fetch('/api/scores', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
  },
  body: JSON.stringify({
    gameName: 'Snake',
    scoreValue: 120,
    metadata: { result: 'game_over' }
  })
});
```

La page d'historique est disponible ici:

- `/pages/scores/history.html`

## Mode dev Docker (live reload)

Le compose est configure pour le dev:

- le backend tourne avec `nodemon`
- `./frontend` et `./backend` sont montes en volumes dans le conteneur

Workflow conseille:

1. Premier lancement (ou apres changement de dependances):
   - `docker compose up --build`
2. Ensuite, pour travailler au quotidien:
   - `docker compose up`
3. Frontend: modifie un fichier puis fais `F5` dans le navigateur
4. Backend: modifie un fichier `backend/*.js`, nodemon redemarre automatiquement

Si tu ajoutes une nouvelle dependance npm, relance avec:

- `docker compose up --build`

## Resume intelligent IA (OpenAI)

Pour activer la synthese intelligente des performances:

- definir `OPENAI_API_KEY`
- optionnel: definir `OPENAI_MODEL` (defaut: `gpt-4o-mini`)

Exemple PowerShell avant `docker compose up`:

```powershell
$env:OPENAI_API_KEY="sk-..."
$env:OPENAI_MODEL="gpt-4o-mini"
docker compose up --build
```

API:

- `GET /api/insights/performance-summary` (JWT requis)

UI:

- page historique des scores, bouton `Generer mon resume IA`
