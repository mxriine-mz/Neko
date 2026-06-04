# Contribuer à Neko

Merci de l'intérêt porté au projet. Ce document décrit la marche à suivre pour
proposer une contribution.

## Avant de commencer

- Consultez les issues ouvertes pour vérifier que le sujet n'est pas déjà traité.
- Pour une fonctionnalité importante, ouvrez d'abord une issue afin d'en discuter
  l'approche avant d'écrire du code.
- Lisez le [README](README.md) pour comprendre l'architecture du monorepo (bot,
  `apps/users-web`, `apps/admin-web`) et la configuration requise.

## Mettre en place l'environnement

```bash
git clone git@github.com:ZelPhyris/Neko.git
cd Neko
npm install
npm run prisma:generate
```

Renseignez un fichier `.env` à partir des variables décrites dans le README. Le
bot et la base de données peuvent être lancés via Docker (`npm run docker:up`).
Chaque application web possède sa propre procédure d'installation, décrite dans
son dossier.

## Workflow de contribution

1. Créez une branche à partir de `main` :
   `git checkout -b type/description-courte` (par exemple `feat/commande-poll`).
2. Effectuez vos modifications en respectant le style du code existant.
3. Vérifiez que le projet démarre et que les fonctionnalités touchées fonctionnent.
   Pour les applications web : `npm run lint` et `npx tsc --noEmit`.
4. Ouvrez une pull request vers `main` en remplissant le modèle proposé.

## Convention de commits

Les messages suivent le format [Conventional Commits](https://www.conventionalcommits.org/) :

```
type(portée): description à l'impératif
```

Types courants : `feat`, `fix`, `docs`, `refactor`, `chore`, `style`, `test`.
La portée est facultative (par exemple `users-web`, `bot`, `prisma`).

Exemples :

```
feat(bot): ajoute la commande de sondage
fix(users-web): corrige la garde admin du tableau de bord
docs: complète la section déploiement du README
```

## Style de code

- Respectez les conventions déjà en place dans le fichier modifié.
- Côté applications web, suivez les règles décrites dans `apps/users-web/README.md`
  (composants serveur par défaut, internationalisation systématique des textes,
  configuration centralisée).
- N'introduisez pas de secret ni de donnée personnelle dans le dépôt.

## Pull requests

- Une PR doit rester ciblée sur un seul sujet.
- Décrivez clairement le quoi et le pourquoi du changement.
- Liez l'issue correspondante le cas échéant.
- Assurez-vous que la branche est à jour avec `main` avant la revue.
