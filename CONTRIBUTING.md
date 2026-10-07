# Contribuer à Match Master

Merci de ton intérêt pour le projet ! Ce guide détaille comment configurer l'environnement de développement et les conventions à respecter.

## 📋 Prérequis

- [Docker](https://www.docker.com/) et Docker Compose
- Un compte [Sportmonks](https://www.sportmonks.com/) pour obtenir un `API_TOKEN`
- [mise](https://mise.jdx.dev/) pour installer les outils de développement (voir l'étape 2)

## 🔧 Installation

### 1. Cloner le projet

```sh
git clone <url-du-repo>
cd match-master
```

### 2. Installer les outils de développement

Les outils de développement sont déclarés dans [`mise.toml`](mise.toml) et installés avec [mise](https://mise.jdx.dev/), aux mêmes versions en local et en CI :

- **Node**, pour les hooks de commit et les scripts npm lancés hors Docker ;
- **[Cocogitto](https://docs.cocogitto.io/)** (`cog`), qui fait respecter les [Conventional Commits](https://www.conventionalcommits.org/) ;
- **[typos](https://github.com/crate-ci/typos)**, qui détecte les fautes de frappe avant chaque commit.

**Installer mise**

```sh
# macOS
brew install mise

# Linux
curl -fsSL https://mise.run | sh

# Windows
winget install jdx.mise
```

Rendre ensuite les outils accessibles au terminal et aux hooks git :

- **bash / zsh** : ajouter `eval "$(mise activate bash)"` (ou `zsh`) à la fin de `~/.bashrc` (ou `~/.zshrc`) ;
- **Windows** : ajouter `C:\Users\<ton-nom>\AppData\Local\mise\shims` au `PATH` de l'utilisateur, au-dessus de `.cargo\bin` s'il y figure. Le nouveau `PATH` ne s'applique qu'aux programmes lancés ensuite : redémarrer Windows (pas une simple mise en veille), ou au moins l'Explorateur Windows depuis le Gestionnaire des tâches.
- **Windows, si Node.js est déjà installé** (dans `C:\Program Files\nodejs`) : le désinstaller, puis lancer `mise use -g node@24`. Le `PATH` système passe avant le `PATH` utilisateur : sans cela, `node` et `npm` restent ceux de l'ancienne installation, même dans le projet.

Pour les autres shells, voir la [documentation de mise](https://mise.jdx.dev/installing-mise.html).

**Installer les outils et les hooks**

À la racine du projet :

```sh
mise install
mise run hooks:install
```

- `mise install` installe Node, `cog` et `typos`. Si mise indique que le fichier `mise.toml` n'est pas approuvé, lancer `mise trust` puis relancer `mise install`.
- `mise run hooks:install` installe les dépendances de `server/`, utilisées par le hook pre-commit (vérification des types et Prettier), puis les hooks git définis dans `cog.toml`. Sans mise, l'équivalent est `cd server && npm install`, puis `cog install-hook --all --overwrite` depuis la racine.

> Cette étape est à refaire sur chaque nouvelle machine après un clone.

**Tâches mise**

`mise.toml` définit des raccourcis pour les opérations courantes. `mise tasks` les liste :

| Tâche                    | Rôle                                                                          |
| ------------------------ | ----------------------------------------------------------------------------- |
| `mise run check`         | Lance les mêmes vérifications que le hook pre-commit, sans créer de commit    |
| `mise run hooks:install` | Installe les dépendances de `server/` et les hooks git                        |
| `mise run db:import`     | Importe toutes les données Sportmonks dans la base Docker locale (étape 6)    |

> La version de Node (Node 24, dernière version disponible) est déclarée à deux endroits : dans `mise.toml` (local et CI) et dans le `FROM` de `server/Dockerfile`. Si tu changes l'une, change aussi l'autre.

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

**Prérequis** :

- un `API_TOKEN` Sportmonks valide dans `.env.development` ;
- les containers démarrés (étape 4) et les migrations appliquées (étape 5).

Une seule commande importe toutes les données depuis l'API Sportmonks, dans le bon ordre (ligues → saisons → équipes → liens équipes/compétitions → effectifs de la saison en cours) :

```sh
docker-compose exec backend npx dotenv -e .env.development -- tsx insert-db/importAll.ts
```

Avec mise, depuis n'importe quel dossier du projet : `mise run db:import`.

Comptez une vingtaine de minutes (19 min mesurées le 25/09/2026) : les scripts marquent une pause de 1,2 s entre deux appels à l'API pour ne pas dépasser le quota Sportmonks.

La même commande sert à **mettre à jour** une base déjà remplie : chaque étape met à jour les données déjà présentes et ajoute les nouvelles. Elle peut être relancée sans risque.

En cas d'échec, le script s'arrête avec un code de sortie non nul et affiche l'erreur complète.

#### Lancer une étape seule

Chaque étape peut aussi être lancée seule, notamment pour mettre à jour uniquement les effectifs. Elles dépendent de l'étape précédente : une étape lancée sur une base sans ligues s'arrête avec un message qui l'indique.

```sh
docker-compose exec backend npx dotenv -e .env.development -- tsx insert-db/insertLeagues.ts
docker-compose exec backend npx dotenv -e .env.development -- tsx insert-db/insertAllSeasons.ts
docker-compose exec backend npx dotenv -e .env.development -- tsx insert-db/insertTeamsFromSeasons.ts
docker-compose exec backend npx dotenv -e .env.development -- tsx insert-db/insertTeamLeague.ts
docker-compose exec backend npx dotenv -e .env.development -- tsx insert-db/insertAllSquads.ts
```

#### Supprimer une compétition

Supprime une compétition, ses favoris et ses liens avec les équipes :

```sh
docker-compose exec backend npx dotenv -e .env.development -- tsx scripts/delete-league.ts <leagueId>
```

Pour qu'elle ne soit pas recréée au prochain import, ajoutez aussi son identifiant à `EXCLUDED_LEAGUE_IDS` dans `server/insert-db/insertLeagues.ts`.

#### Import automatique en production

En production, l'import de toutes les données tourne automatiquement **chaque lundi à 03:00 UTC**, avec le workflow GitHub Actions « Import SportMonks data » (`.github/workflows/import-db.yml`). Il peut aussi être lancé à la main depuis l'onglet _Actions_ du dépôt (« Run workflow »). Les secrets `DATABASE_URL`, `URL_API` et `API_TOKEN` sont définis dans les paramètres du dépôt.

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
