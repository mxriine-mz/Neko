const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "thread",
  category: "utility",
  permissions: PermissionFlagsBits.CreatePrivateThreads,
  ownerOnly: false,
  usage: "thread",
  examples: ["thread"],
  description: "Gestion des threads (en cours de développement).",

  // Prefix
  run: async (client, message, args, guildSettings, userSettings) => {
    return message.reply(
      "La commande **thread** est en cours de développement. Elle permettra bientôt de créer et gérer des threads."
    );
  },

  // Slash
  options: [
    {
      name: "action",
      description: "Action à effectuer (bientôt disponible).",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        { name: "create", value: "create" },
        { name: "delete", value: "delete" },
        { name: "archive", value: "archive" },
        { name: "unarchive", value: "unarchive" },
        { name: "lock", value: "lock" },
        { name: "unlock", value: "unlock" },
        { name: "modify", value: "modify" },
      ],
    },
  ],

  runInteraction: async (client, interaction, guildSettings, userSettings) => {
    return interaction.reply({
      content:
        "La commande **thread** est en cours de développement. Elle permettra bientôt de créer et gérer des threads.",
      ephemeral: true,
    });
  },
};
