# Neko

Neko est un écosystème Discord composé d'un bot multifonction et de deux
applications web. Le bot gère la modération, un système de niveaux, les tickets,
les anniversaires et plusieurs jeux. Les sites web fournissent un portail public
avec tableau de bord de configuration ainsi qu'un panneau d'administration privé.

Toutes les applications partagent une base de données PostgreSQL unique via
Prisma, garantissant une source de vérité commune.

## Sommaire

- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Le bot](#le-bot)
- [Base de données](#base-de-données)
- [Applications web](#applications-web)
- [Déploiement](#déploiement)
- [Structure du dépôt](#structure-du-dépôt)
- [Versionnage](#versionnage)
- [Licence](#licence)

## Architecture

Le dépôt est un monorepo regroupant trois applications autour d'une même base
PostgreSQL.

```
Neko/
├── src/, main.js        Bot Discord (Node.js, discord.js v14)
├── config/              Configuration du bot, schéma Prisma, Docker, scripts
└── apps/
    ├── users-web/       Site public et tableau de bord de configuration
    └── admin-web/       Panneau d'administration privé
```

| Composant   | Stack                                                       | Rôle                                                         |
| ----------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| Bot         | Node.js 20, discord.js 14, Prisma, PostgreSQL, Docker       | Modération, niveaux, tickets, anniversaires, jeux           |
| `users-web` | Next.js 16, TypeScript, Tailwind v4, next-intl, NextAuth v5 | Landing page et tableau de bord de configuration par serveur |
| `admin-web` | Next.js 16, TypeScript, Tailwind v4, NextAuth v5            | Supervision de la base, gestion de notes et planificateur   |

## Prérequis

- Node.js 20 ou supérieur
- npm 10 ou supérieur
- Docker et Docker Compose (pour le déploiement du bot)
- PostgreSQL 16 (si exécution sans Docker)
- Une application Discord avec un token de bot

## Installation

```bash
git clone git@github.com:ZelPhyris/Neko.git
cd Neko
npm install
```

Générez le client Prisma du bot :

```bash
npm run prisma:generate
```

## Configuration

La configuration du bot repose sur un fichier `.env` à la racine. Les variables
principales sont les suivantes.

| Variable              | Description                                       |
| --------------------- | ------------------------------------------------- |
| `TOKEN`               | Token du bot Discord                              |
| `CLIENT_ID`           | Identifiant de l'application Discord              |
| `OWNER_ID`            | Identifiant Discord du propriétaire               |
| `PREFIX`              | Préfixe par défaut des commandes (par défaut `!`) |
| `NODE_ENV`            | `development` ou `production`                     |
| `LOG_LEVEL`           | Niveau de journalisation                          |
| `DB_HOST`             | Hôte PostgreSQL                                   |
| `DB_PORT`             | Port PostgreSQL                                   |
| `DB_USER`             | Utilisateur PostgreSQL                            |
| `DB_PASSWORD`         | Mot de passe PostgreSQL                           |
| `DB_NAME`             | Nom de la base                                    |
| `DATABASE_URL`        | URL de connexion Prisma (exécution locale)        |
| `DATABASE_URL_DOCKER` | URL de connexion Prisma depuis le réseau Docker   |

Le préfixe peut ensuite être ajusté par serveur depuis le tableau de bord ou la
commande de configuration ; la valeur du `.env` sert de repli.

Le fichier `.env` ne doit jamais être versionné. Chaque application web possède
sa propre configuration ; se reporter à leur documentation respective.

## Démarrage

### Avec Docker (recommandé)

```bash
npm run docker:build      # construire l'image du bot
npm run docker:up         # démarrer le bot et PostgreSQL
npm run docker:logs       # suivre les journaux du bot
npm run docker:down       # arrêter les services
```

Le démarrage applique automatiquement les migrations Prisma avant de lancer le
bot.

### En local

```bash
npm run prisma:deploy     # appliquer les migrations
npm run dev               # démarrage avec rechargement à chaud (nodemon)
npm start                 # démarrage standard
```

## Le bot

Le bot s'appuie sur un système de chargeurs (`src/Loaders`) qui enregistrent
dynamiquement les commandes, les événements, les boutons et les menus déroulants.
La connexion à la base et les fonctions associées sont injectées sur le client
Discord au démarrage.

L'ensemble des fonctionnalités se configure par serveur via le modèle `Guild`.

### Modération

- Sanctions : bannissement, expulsion, exclusion temporaire, débannissement
- Avertissements : ajout, retrait, consultation
- Nettoyage de messages
- Auto-modération : anti-spam, anti-liens, anti-mentions de masse,
  anti-majuscules et filtrage de mots interdits, avec journalisation et
  avertissements automatiques

### Niveaux

Gain d'expérience à chaque message, avec délai de récupération par utilisateur,
notification de passage de niveau, classement et commandes d'ajustement manuel
de l'expérience.

### Utilitaires

Système de tickets complet (boutons et menus), sondages, fils de discussion,
anniversaires et gestion des salons vocaux.

### Divertissement

Morpion, pendu, Simon, images d'anime et commandes diverses.

### Administration

Configuration du serveur, synchronisation des commandes et gestion du préfixe.

## Base de données

Le schéma Prisma (`config/prisma/schema.prisma`) définit trois modèles.

- `Guild` : configuration complète par serveur (journaux, accueil et départs,
  annonces, tickets, niveaux, modération, rôles automatiques, anniversaires).
- `User` : données utilisateur par serveur (expérience, niveau, tickets, statut,
  modération).
- `Warning` : avertissements rattachés à un utilisateur.

## Applications web

Les deux applications web vivent dans `apps/` et sont des projets Next.js
autonomes partageant la base du bot.

### users-web

Site public et tableau de bord de configuration. Authentification Discord
(OAuth), interface bilingue (français et anglais) et configuration des modules
pilotée par les données : chaque réglage correspond à une colonne du modèle
`Guild`. L'accès au tableau de bord d'un serveur vérifie côté Discord que
l'utilisateur en est administrateur. Voir `apps/users-web/README.md` pour le
détail.

```bash
cd apps/users-web
npm install
npm run dev               # serveur de développement (port 3002)
```

### admin-web

Panneau d'administration privé réservé au propriétaire. Il expose des
statistiques sur la base du bot ainsi qu'un système de notes et un
planificateur (tableau Kanban et diagramme de Gantt) stockés dans sa propre
base. L'application utilise deux clients Prisma distincts : un en lecture sur la
base du bot, un sur sa base d'administration.

```bash
cd apps/admin-web
npm install
npm run dev               # serveur de développement (port 3000)
```

## Déploiement

Le bot et PostgreSQL sont déployés via Docker Compose. Les deux applications web
sont servies par Next.js derrière un reverse proxy nginx et gérées par PM2 :

- Site public : `neko.mxrine-mz.dev` (port interne 3002)
- Panneau d'administration : `neko-db.mxrine-mz.dev` (port interne 3000)

La configuration nginx de référence se trouve dans `neko.nginx.conf`.

## Structure du dépôt

```
Neko/
├── main.js                 Point d'entrée du bot
├── package.json            Dépendances et scripts du bot
├── config/
│   ├── bot.config.js       Configuration centralisée du bot
│   ├── database.js         Client Prisma et connexion
│   ├── prisma/             Schéma et migrations
│   ├── docker/             Dockerfile et fichiers Compose
│   └── scripts/            Scripts de démarrage, sauvegarde et restauration
├── src/
│   ├── Commands/           Commandes (modération, niveaux, utilitaires, jeux)
│   ├── Events/             Événements Discord
│   ├── Buttons/            Interactions par boutons
│   ├── Selects/            Menus déroulants
│   ├── Loaders/            Chargeurs de modules et fonctions de base de données
│   └── Assets/             Ressources et fonctions auxiliaires
├── apps/
│   ├── users-web/          Site public et tableau de bord
│   └── admin-web/          Panneau d'administration
└── neko.nginx.conf         Configuration nginx de référence
```

## Versionnage

La version 1 est figée par le tag `v1.0.0` et conservée sur la branche `v1.0`.
La branche `main` correspond à la version 2, une refonte fondée sur PostgreSQL,
Prisma, Docker et une architecture en monorepo.

## Licence

ISC
