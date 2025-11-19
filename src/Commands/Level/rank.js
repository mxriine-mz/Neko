const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "rank",
  category: "level",
  permissions: PermissionFlagsBits.ViewChannel,
  ownerOnly: false,
  usage: "rank",
  examples: ["rank", "rank @user"],
  description: "Affiche la carte de niveau (fonction en cours de développement)",

  run: async (client, message, args, guildSettings, userSettings) => {
    return message.reply(
      "La commande **rank** est en cours de développement. Elle affichera bientôt une carte graphique personnalisée !"
    );
  },

  runInteraction: async (client, interaction, guildSettings, userSettings) => {
    return interaction.reply({
      content:
        "La commande **rank** est en cours de développement. Elle affichera bientôt une carte graphique personnalisée !",
      ephemeral: true,
    });
  },
};
