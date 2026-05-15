# Contribuer à Match Master

Merci de ton intérêt pour le projet ! Ce guide détaille comment configurer l'environnement de développement et les conventions à respecter.

## 📋 Prérequis

- [Docker](https://www.docker.com/) et Docker Compose
- Un compte [Sportmonks](https://www.sportmonks.com/) pour obtenir un `API_TOKEN`

## 🔧 Installation

### 1. Cloner le projet

```sh
git clone <url-du-repo>
cd match-master
```

### 2. Installer Cocogitto (hook de commit)

Ce projet utilise [Cocogitto](https://docs.cocogitto.io/) pour enforcer les [Conventional Commits](https://www.conventionalcommits.org/).

**macOS / Linux**
```sh
brew install cocogitto
cog install-hook --all
```

**Windows**
```sh
cargo install cocogitto
cog install-hook --all
```

> Si `cargo` n'est pas disponible, installe [Rust](https://rustup.rs/) au préalable.

> Cette étape est à refaire sur chaque nouvelle machine après un clone.

### 3. Configurer les variables d'environnement

```sh
cd server
cp .env.example .env.development
```

Remplir les valeurs dans `.env.development`. Pour la variable `DATABASE_URL`, utiliser la valeur indiquée en commentaire dans `.env.example` qui correspond à la base Docker locale.

### 4. Lancer le backend

```sh
cd server
docker-compose up --build
```

Le serveur démarre sur `http://localhost:3000`.  
La documentation de l'API est disponible sur `http://localhost:3000/api-docs`.

### 5. Appliquer les migrations

Une fois les containers démarrés, créer le schéma de la base de données :

```sh
docker-compose exec backend npm run migrate:dev
```

### 6. Alimenter la base de données

Les scripts suivants importent les données depuis l'API Sportmonks. Ils doivent être exécutés **dans l'ordre** :

```sh
docker-compose exec backend npx dotenv -e .env.development -- tsx insert-db/insertLeagues.ts
docker-compose exec backend npx dotenv -e .env.development -- tsx insert-db/insertAllSeasons.ts
docker-compose exec backend npx dotenv -e .env.development -- tsx insert-db/insertTeamsFromSeasons.ts
docker-compose exec backend npx dotenv -e .env.development -- tsx insert-db/insertTeamLeague.ts
docker-compose exec backend npx dotenv -e .env.development -- tsx insert-db/insertAllSquads.ts
```

> ⚠️ Chaque script dépend du précédent. Ne pas sauter d'étape.

## 🧪 Tests

```sh
cd server
npm run test
```

## 🗄️ Migrations Prisma

Appliquer les migrations en développement :

```sh
npm run migrate:dev
```

Appliquer les migrations en production :

```sh
npm run migrate:prod
```

## 📝 Conventions de commit

Ce projet suit les [Conventional Commits](https://www.conventionalcommits.org/). Le hook Cocogitto valide automatiquement le format à chaque commit.

Exemples de messages valides :

```
feat: add player statistics endpoint
fix: correct standings calculation
chore: update dependencies
docs: improve setup instructions
```
