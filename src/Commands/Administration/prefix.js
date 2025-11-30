const { ApplicationCommandOptionType, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
  name: "prefix",
  category: "administration",
  permissions: PermissionFlagsBits.KickMembers, // tu l’avais et je respecte
  ownerOnly: true,                              // tu l’avais aussi, donc on garde
  usage: "prefix [value]",
  examples: ["prefix !", "prefix ?", "prefix neko!"],
  description: "Afficher ou modifier le préfixe du serveur.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    const value = args[0];

    // ——————————————————————————————
    // CHANGEMENT DU PREFIX
    // ——————————————————————————————
    if (value) {
      // On pourrait vérifier longueur / caractères si tu veux
      await client.updateGuild(message.guild, { prefix: value });

      return message.reply({
        content: `**${message.author.username}**, le préfixe a été mis à jour avec succès.\nNouveau préfixe : \`${value}\``,
      });
    }

    // ——————————————————————————————
    // LECTURE DU PREFIX ACTUEL
    // ——————————————————————————————
    return message.reply({
      content: `**${message.author.username}**, le préfixe actuel de ce serveur est : \`${guildSettings.prefix}\``,
    });
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [
    {
      name: "value",
      description: "Nouveau préfixe à assigner",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  async runInteraction(client, interaction, guildSettings) {
    const value = interaction.options.getString("value");

    // ——————————————————————————————
    // CHANGEMENT DU PREFIX
    // ——————————————————————————————
    if (value) {
      await client.updateGuild(interaction.guild, { prefix: value });

      return interaction.reply({
        content: `**${interaction.user.username}**, le préfixe a été mis à jour avec succès.\nNouveau préfixe : \`${value}\``,
        flags: MessageFlags.Ephemeral,
      });
    }

    // ——————————————————————————————
    // LECTURE DU PREFIX ACTUEL
    // ——————————————————————————————
    return interaction.reply({
      content: `**${interaction.user.username}**, le préfixe actuel de ce serveur est : \`${guildSettings.prefix}\``,
      flags: MessageFlags.Ephemeral,
    });
  },
};
