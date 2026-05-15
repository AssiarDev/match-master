# Match Master ⚽

Match Master est une application web permettant de suivre l'actualité du football : scores, matchs, classements !

> **Note :** Ce projet est réalisé à des fins d'apprentissage uniquement. Les données sportives sont fournies par [Sportmonks](https://www.sportmonks.com/) dans le cadre d'un usage non commercial et éducatif. Ce projet n'a aucune vocation commerciale.

## 📌 Fonctionnalités

- 🔥 Suivre les matchs du jour en fonction de la date sélectionnée
- 🏆 Suivre l'actualité d'une compétition pour rester informé des derniers résultats et événements
- ⭐ Sélectionner son équipe ou sa compétition favorite et suivre son classement ainsi que ses matchs
- 🔑 Authentification pour une expérience personnalisée et la gestion des préférences utilisateur

## 🔮 Fonctionnalités à venir

- 📡 **Suivre les matchs en live** avec mises à jour en temps réel
- 📊 **Détails des statistiques des matchs** pour une analyse approfondie
- 📰 **Articles sur les équipes ou compétitions** pour en apprendre davantage sur le football

### 🌍 Objectif à long terme

L'objectif futur de Match Master est d'élargir ces fonctionnalités à **tous les sports**, offrant une plateforme complète pour suivre l'actualité sportive en un seul endroit.

## 🚀 Stack technique

- **Frontend :** React, Tailwind CSS
- **Backend :** Node.js, Express, TypeScript
- **Base de données :** PostgreSQL (locale via Docker), Prisma ORM, Neon (prod)
- **API externe :** [Sportmonks](https://www.sportmonks.com/)

## 📋 Prérequis

- [Docker](https://www.docker.com/) et Docker Compose
- Un compte [Sportmonks](https://www.sportmonks.com/) pour obtenir un `API_TOKEN`

## 🚀 Lancement rapide

```sh
git clone <url-du-repo>
cd match-master/server
cp .env.example .env.development
# Remplir les valeurs dans .env.development
docker-compose up --build
```

Le serveur démarre sur `http://localhost:3000`.  
La documentation de l'API est disponible sur `http://localhost:3000/api-docs`.

## 🤝 Contribuer

Pour configurer l'environnement de développement, appliquer les migrations, alimenter la base de données et respecter les conventions du projet, consulte [CONTRIBUTING.md](CONTRIBUTING.md).