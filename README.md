# Document de Cadrage - Moulti Game

- **Module :** Developpement d'application front/back
- **Rendu :** Document de cadrage
- **Date limite :** `24/04/2026`

## Liens depots GitHub

- **Repository principal :** A COMPLETER (`https://github.com/Angelina974/moulti-game`)

---

## 1) Brief Projet

### 1.1 Presentation generale

- **Nom du projet :** Moulti Game
- **Description courte :**
  Moulti Game est une application web de mini-jeux (Snake, Simon, Pendu, Devine Nombre, Puissance 4) avec authentification utilisateur. Chaque joueur peut se connecter, jouer, enregistrer ses scores et consulter son historique par jeu. Une fonctionnalite IA genere un resume intelligent des performances pour orienter la progression. L'application cible un usage simple, rapide et ludique depuis navigateur.
- **Probleme resolu :**
  Les mini-jeux web sont souvent disperses, sans suivi personnel ni retour intelligent sur la progression. Le projet centralise plusieurs jeux dans une meme interface avec historique de scores et recommandations de progression.
- **Public cible :**
  Etudiants / joueurs occasionnels souhaitant jouer rapidement et suivre leur evolution.

### 1.2 Arborescence (Arbo)

```text
Accueil (/)
├── Connexion (/pages/auth/login.html)
├── Inscription (/pages/auth/register.html)
├── Menu jeux (/pages/welcome.html)
│   ├── Devine Nombre
│   ├── Pendu
│   ├── Puissance 4
│   ├── Simon
│   └── Snake
└── Historique des scores (/pages/scores/history.html)
    ├── Filtre par jeu
    ├── Resume intelligent IA
    └── Suppression de l'historique (global / par jeu)
```


### 1.4 Liste des fonctionnalites (Features)

| Priorite | Fonctionnalite | Description courte | Role concerne |
|----------|----------------|--------------------|---------------|
| 🔴 Must have | Inscription / Connexion | Creer un compte et s'authentifier | Tous |
| 🔴 Must have | JWT + routes protegees | Protection des API et pages sensibles | Tous |
| 🔴 Must have | Jouer aux mini-jeux | Lancer une partie depuis le menu | Joueur |
| 🔴 Must have | Enregistrement des scores | Sauvegarder le score en base PostgreSQL | Joueur |
| 🔴 Must have | Historique des scores | Voir les scores passes (filtre par jeu) | Joueur |
| 🔴 Must have | Resume intelligent IA | Synthese personnalisee des performances | Joueur |
| 🟡 Should have | Suppression historique | Supprimer scores globaux ou par jeu | Joueur |
| 🟡 Should have | Docker compose dev | Lancer backend + DB facilement | Dev |
| 🟢 Nice to have | Export CSV historique | Export des performances | Joueur |
| 🟢 Nice to have | Classement global | Comparaison entre joueurs | Joueur |

---

## 2) Modelisation de la base de donnees

### 2.1 MCD (Modele Conceptuel de Donnees)

**Entites :**
- **Player** : id, username, email, password_hash, created_at
- **PlayerScore** : id, game_name, score_value, metadata, played_at

**Associations :**
- Un **Player** peut avoir **0..N** scores
- Un **PlayerScore** appartient a **1..1** Player

**Cardinalites :**
- Player (1,1) ---- (0,N) PlayerScore

### 2.2 MLD (Modele Logique de Donnees)

```text
player (
  _id_,
  username,
  email,
  password_hash,
  created_at
)

player_score (
  _id_,
  #player_id,
  game_name,
  score_value,
  metadata,
  played_at
)
```

### 2.3 MPD (Modele Physique de Donnees)

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_scores (
    id BIGSERIAL PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    game_name VARCHAR(100) NOT NULL,
    score_value INTEGER NOT NULL,
    metadata JSONB,
    played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_email ON players (email);
CREATE INDEX IF NOT EXISTS idx_scores_player_game ON player_scores (player_id, game_name, played_at DESC);
```

---

## 3) Definition de la Stack Technique

### 3.1 Frontend

| Element | Choix | Justification |
|---------|-------|---------------|
| Framework / Bibliotheque | HTML/CSS/JS vanilla | Scope maitrise, rapide a mettre en place pour plusieurs mini-jeux |
| Langage | JavaScript | Compatible browser natif, simple pour gameplay + API calls |
| UI / CSS | CSS custom | Controle total du style arcade et des pages de jeux |
| Routage | Routage par pages statiques | Suffisant pour un MVP multi-pages sans complexite SPA |

### 3.2 Backend

| Element | Choix | Justification |
|---------|-------|---------------|
| Runtime / Framework | Node.js + Express | Rapide pour API REST, middleware simple (auth, JSON, static) |
| Langage | JavaScript | Coherence fullstack avec le frontend |
| Authentification | JWT | Stateless, adapte a API protegee par token Bearer |
| ORM / Requetes | SQL via `pg` | Controle SQL fin, peu de surcouche pour ce scope |

### 3.3 Base de donnees

| Element | Choix | Justification |
|---------|-------|---------------|
| SGBD | PostgreSQL | Fiable, SQL robuste, JSONB pour metadata de score |
| Hebergement | Conteneur Docker local (dev) | Reproductible, simple a lancer avec backend |

### 3.4 Outils & infrastructure

| Element | Choix |
|---------|-------|
| Versioning | Git + GitHub |
| Deploiement | Docker Compose (environnement local) |
| Gestion de projet | README + Git commits (possible extension Trello/Notion) |

---

## 4) Fonctionnalite IA

### 4.1 Description de la fonctionnalite

- **Fonctionnalite IA integree :** Resume intelligent des performances joueur
- **Probleme resolu :** Le joueur ne sait pas facilement sur quel jeu il progresse ou regresse
- **Moment UX :** Depuis la page historique des scores, bouton **"Generer mon resume IA"**

### 4.2 Choix technique

- **Modele utilise :** OpenAI `gpt-4o-mini` (configurable via `OPENAI_MODEL`)
- **Integration architecture :**
  - Appel IA cote **backend** (route protegee)
  - Endpoint : `GET /api/insights/performance-summary`
- **Entree envoyee au modele :**
  - Statistiques agregees des scores (`sessions`, `moyenne`, `best`, `trend`, etc.)
- **Sortie attendue :**
  - JSON structure : `overview`, `strengths[]`, `focusPoints[]`, `recommendedGame`, `recommendationReason`, `nextGoal`

### 4.3 Type de fonctionnalite IA (categorie)

- ✅ **Analyse de donnees / prediction**
- ✅ **Resume intelligent (generation de contenu texte)**
- ✅ Fonctionnalite **reellement implementee** dans le code

---

## Annexes techniques (execution)

### Docker (dev)

```powershell
docker compose up --build
```

### Variables d'environnement utiles

```powershell
$env:OPENAI_API_KEY="sk-..."
$env:OPENAI_MODEL="gpt-4o-mini"
```

### Endpoints principaux

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/scores`
- `GET /api/scores/games`
- `GET /api/scores/history`
- `DELETE /api/scores/history`
- `GET /api/insights/performance-summary`

---

