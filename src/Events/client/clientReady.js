// src/Events/client/clientReady.js
require("dotenv").config();
const Logger = require("../../Loaders/Logger");

module.exports = {
  name: "clientReady",
  once: true,

  async execute(client) {
    Logger.client(`- connecté en tant que ${client.user.tag}`);

    // Déploiement "runtime" des commandes (à garder si tu ne veux pas de script séparé)
    if (client.commands?.size) {
      await client.application.commands.set(
        client.commands.map((cmd) => cmd)
      );
      Logger.command(`- ${client.commands.size} commandes enregistrées`);
    }

    // Membre count optionnel
    const guildId = process.env.GUILD_ID;
    const memberChannelId = process.env.MEMBER_COUNT_CHANNEL_ID;

    if (!guildId || !memberChannelId) {
      Logger.warn(
        "GUILD_ID ou MEMBER_COUNT_CHANNEL_ID manquant, compteur de membres désactivé"
      );
      return;
    }

    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      Logger.warn(
        `Impossible de trouver la guilde ${guildId} dans le cache, compteur de membres désactivé`
      );
      return;
    }

    const updateMemberCount = () => {
      const memberCountChannel = guild.channels.cache.get(memberChannelId);
      if (!memberCountChannel) {
        Logger.warn(
          `Channel compteur de membres introuvable (${memberChannelId})`
        );
        return;
      }
      const memberCount = guild.memberCount;
      memberCountChannel.setName(`Members : ${memberCount}꒷ₓₒ`).catch((err) =>
        Logger.warn(`Impossible de mettre à jour le channel membres: ${err}`)
      );
    };

    // Mise à jour immédiate puis périodique
    updateMemberCount();
    setInterval(updateMemberCount, 10000);
  },
};
