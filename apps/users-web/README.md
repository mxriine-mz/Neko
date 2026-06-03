# Neko — apps/users-web

Site public + (futur) dashboard du bot Discord **Neko**. Next.js 16 (App Router),
TypeScript strict, Tailwind v4, next-intl (fr/en), next-auth v5 (Discord OAuth),
Prisma partagé avec le bot. Dev sur `127.0.0.1:3002`.

> Ce dossier est un projet **autonome** dans le monorepo Neko. Le bot vit dans
> `../../src` (racine du repo), le viewer DB privé dans `../admin-web`
> (anciennement `web-viewer` — ne pas y toucher depuis ici).

## Commandes

```bash
npm run dev     # serveur de dev (port 3002)
npm run build   # build de prod
npm run lint    # eslint
npx tsc --noEmit  # typecheck
```

## Architecture des dossiers

```
app/
  [locale]/        Pages localisées. layout.tsx = <html>/<body> + providers.
                   page.tsx ne fait QUE composer des sections.
    dashboard/     Zone protégée (layout = garde requireSession + nav).
                   page.tsx = liste des serveurs. [guildId]/ = éditeur de config
                   (page.tsx affiche les ModuleCard, actions.ts = server actions).
  api/             Route handlers (auth NextAuth, futures API du dashboard).
  globals.css      Tokens de thème (@theme) — thème dark unique.
components/
  ui/              Primitives réutilisables, sans logique métier
                   (Container, Badge, GradientText, buttonVariants, LocaleSwitcher).
  layout/          Structure de page publique (Navbar, Footer).
  sections/        Blocs de la landing (Hero, Features, Steps).
  dashboard/       Composants du dashboard (DashboardNav, ServerCard, ModuleCard, Field).
config/site.ts     Constantes partagées (INVITE_URL, NAV_LINKS, FEATURES, MODULE_ICONS).
lib/
  prisma.ts        Client Prisma.
  discord.ts       API REST Discord (guilds via OAuth, salons/rôles via bot token).
  auth-guard.ts    requireSession / requireGuildAdmin (gardes serveur).
  guild-config.ts  Métadonnées déclaratives des modules de config (= colonnes Guild).
  cn.ts            Concat de classes conditionnelles.
i18n/              Config next-intl (routing, navigation, request).
messages/          Traductions fr.json / en.json (namespace Dashboard inclus).
types/             Augmentations TS (next-auth.d.ts → session.accessToken).
auth.ts            Config NextAuth (racine = convention next-auth v5).
```

## Conventions

- **Page = composition.** Une page ne contient pas de markup détaillé : elle
  assemble des composants `layout/` et `sections/`. Le détail vit dans le composant.
- **Pas de constante en dur dispersée.** URLs, liens, listes → `config/site.ts`.
- **Tout texte visible passe par i18n.** Pas de chaîne en dur dans le JSX ;
  ajouter la clé dans `messages/fr.json` ET `messages/en.json`. Les composants
  serveur utilisent `getTranslations`, les composants client `useTranslations`.
- **Server Components par défaut.** N'ajouter `'use client'` que si interactivité
  réelle (state, effets, handlers). Ex. client actuel : `LocaleSwitcher`.
- **Styles.** Tailwind utility-first + tokens de `globals.css`. Pour des classes
  conditionnelles, utiliser `cn()`. Boutons : `buttonVariants({ variant, size })`.
- **Imports** via l'alias `@/*` (racine du dossier `apps/users-web`).
- **Nommage des fichiers composants** : PascalCase (`Navbar.tsx`).

## Prisma

`prisma/schema.prisma` est un **symlink** vers `../../config/prisma/schema.prisma`
(le schéma du bot). On lit/écrit la même DB Postgres. Ne pas dupliquer le schéma ;
toute modif de modèle se discute avec le bot. Client : `import { prisma } from '@/lib/prisma'`.

## Auth

next-auth v5, provider Discord, scopes `identify guilds`, sessions JWT.
L'`accessToken` Discord est propagé dans la session (cf. `auth.ts`, typé dans
`types/next-auth.d.ts`) et sert à lister les serveurs de l'utilisateur.

⚠️ Les credentials OAuth du site (`DISCORD_CLIENT_ID/SECRET`) doivent être
remplis dans `.env` (app Discord dédiée) pour que la connexion fonctionne.

## Dashboard

- **Garde** : `dashboard/layout.tsx` appelle `requireSession`. La page `[guildId]`
  appelle `requireGuildAdmin` qui re-vérifie côté Discord que l'utilisateur est
  admin du serveur — jamais sur la seule foi de l'URL. Les server actions
  re-vérifient aussi (ne jamais faire confiance au formulaire).
- **Config pilotée par les données** : `lib/guild-config.ts` décrit chaque module
  et ses champs (= colonnes `Guild`). `ModuleCard` les rend, `actions.ts`
  (`updateGuildConfig`) coerce par type et fait un `upsert`. Ajouter un réglage =
  ajouter une ligne dans `guild-config.ts` + les libellés i18n `Dashboard.fields.*`.
- **Sélecteurs salon/rôle** : alimentés via le bot token (`DISCORD_BOT_TOKEN`,
  optionnel — cf. `.env.example`). Absent → repli sur saisie d'ID texte.

## Reste à faire

- Brancher l'app OAuth Discord (remplir `.env`) pour tester la connexion live.
- Repointer le process PM2 `neko-web` vers `apps/users-web` (déploiement).
- Pistes : page Commandes, statut, premium ; toggle visuel (au lieu de checkbox) ;
  feedback de sauvegarde (état pending via un petit Client Component).
