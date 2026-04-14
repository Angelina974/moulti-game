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
