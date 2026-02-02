# Neko 1.0 - Bot Discord

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Discord.js](https://img.shields.io/badge/Discord.js-14.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)
![Mongoose](https://img.shields.io/badge/Mongoose-6.x-red)

Bot Discord multifonctionnel avec système de niveaux, modération, tickets et plus encore.

## Fonctionnalités

- **Commandes Fun** : anime, say, alea
- **Système de niveaux** : XP, rank, leaderboard
- **Modération** : kick, ban, mute, warn, clear
- **Système de tickets** : Support utilisateur
- **Annonces** : Système d'annonces personnalisé
- **Administration** : Configuration du serveur
- **Embeds personnalisés** : Création d'embeds
- **Gestion threads & vocal**

## Prérequis

- **Node.js** 18.x ou supérieur
- **MongoDB** 6.x (local ou Atlas)
- Un **Bot Discord** avec token

## 📁 Structure du Projet

```
Neko1.0/
├── src/
│   ├── Commands/             # Commandes du bot
│   │   ├── Administration/   # Setup, prefix, reload
│   │   ├── Fun/             # anime, say, alea
│   │   ├── Info/            # help, ping, userinfo
│   │   ├── Level/           # rank, levels, xp
│   │   ├── Moderation/      # ban, kick, mute, warn
│   │   ├── Utility/         # poll, ticket, thread
│   │   └── Embed/           # Embeds personnalisés
│   │
│   ├── Events/              # Événements Discord
│   │   ├── client/          # ready, interactionCreate
│   │   ├── guild/           # guildCreate, threadCreate
│   │   └── guild_messages/  # messageCreate
│   │
│   ├── Buttons/             # Boutons interactifs
│   ├── Selects/             # Menus de sélection
│   ├── Assets/              # GIFs, images, menus
│   ├── Models/              # Modèles Mongoose
│   └── Loaders/             # Chargeurs de modules
│
├── main.js                  # Point d'entrée
├── package.json             # Dépendances
└── .env                     # Variables d'environnement
```

## 📝 Commandes Disponibles

### Info
- `!help [commande]` - Menu d'aide
- `!ping` - Latence du bot
- `!userinfo [@user]` - Informations utilisateur
- `!announce <message>` - Créer une annonce

### Fun
- `!anime <action> [@user]` - GIFs animés
- `!say <message>` - Répéter un message
- `!alea <opt1> <opt2>...` - Choix aléatoire

### Level
- `!rank [@user]` - Voir son niveau
- `!levels` - Classement serveur
- `!add_xp @user <montant>` - Ajouter XP
- `!remove_xp @user <montant>` - Retirer XP

### Moderation
- `!kick @user [raison]` - Expulser
- `!ban @user [raison]` - Bannir
- `!softban @user` - Bannir temporairement
- `!mute @user <durée> [raison]` - Mute
- `!unmute @user` - Démute
- `!warn @user <raison>` - Avertir
- `!clear <nombre>` - Supprimer messages

### Administration
- `!prefix <nouveau>` - Changer le préfixe
- `!setup` - Configuration initiale
- `!emit <event>` - Émettre un événement

### Utility
- `!poll <question>` - Créer un sondage
- `!ticket` - Créer un ticket
- `!thread <nom>` - Créer un thread
- `!vocal` - Gérer les salons vocaux

## Base de Données

### Modèles Mongoose

**Guild** - Configuration serveur
```javascript
{
  id: String,
  name: String,
  prefix: String,
  logs: { enabled, channel },
  welcome: { enabled, channel, message },
  tickets: { category, logs },
  levels: { enabled, channel }
}
```

**User** - Données utilisateur
```javascript
{
  id: String,
  user: String,
  xp: Number,
  level: Number,
  warnings: [{ reason, moderator, date }]
}
```

## 🔄 Migration vers v2.0

**Neko 1.0** utilise une architecture traditionnelle avec MongoDB et un déploiement manuel. Bien que fonctionnelle, cette version présente certaines limites en termes de scalabilité et de maintenance.

**Neko 2.0** introduit des améliorations majeures :
- **Docker** : Déploiement containerisé pour une meilleure portabilité et isolation
- **PostgreSQL** : Base de données relationnelle plus robuste avec de meilleures performances
- **Architecture modernisée** : Code optimisé et structure améliorée
- **CI/CD** : Pipeline d'intégration et déploiement automatisé
- **Scalabilité** : Gestion facilitée de multiples instances

**Pour migrer vers la version modernisée, consultez [Neko 2.0](../Neko2.0/README.md)**

> ⚠️ **Note** : Neko 1.0 reste maintenu pour les déploiements simples sans Docker. La migration vers v2.0 est recommandée pour les environnements de production.

## 🔒 Sécurité

- ✅ Ne jamais commit le fichier `.env`
- ✅ Utiliser des tokens sécurisés
- ✅ Restreindre les commandes owner
- ✅ Valider les entrées utilisateur

## 📜 Licence

ISC

## 👤 Auteur

**Ma'**

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un pull request.

---

