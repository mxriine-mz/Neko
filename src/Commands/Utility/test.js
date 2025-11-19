const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "test",
  category: "utility",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: false,
  usage: "test",
  examples: ["test"],
  description: "Commande de test (placeholder).",

  run: async (client, message, args, guildSettings, userSettings) => {
    return message.reply("Commande **test** vide pour le moment.");
  },

  runInteraction: async (client, interaction, guildSettings, userSettings) => {
    return interaction.reply({
      content: "Commande **test** vide pour le moment.",
      ephemeral: true,
    });
  },
};
