const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, MessageFlags} = require("discord.js");

module.exports = {
  name: "announce",
  category: "administration",
  permissions: PermissionFlagsBits.ManageGuild,
  ownerOnly: true,
  usage: ["announce <#salon>"],
  examples: ["announce #annonces"],
  description: "Définit le salon utilisé pour les annonces du serveur.",

  // ————————————————————————————————————————
  // OPTIONS SLASH — Setup du salon uniquement
  // ————————————————————————————————————————
  options: [
    {
      name: "salon",
      description: "Le salon où seront envoyées les annonces.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings) => {
    // Pas de salon → embed d'aide rapide et propre
    if (!args[0]) {
      const embed = new EmbedBuilder()
        .setColor("#ff8ccf")
        .setTitle("Configuration du salon d'annonce")
        .setDescription(
          "Veuillez mentionner un salon valide pour définir le salon d'annonces."
        )
        .addFields({
          name: "Exemple",
          value: "`announce #annonces`",
        });

      return message.reply({ embeds: [embed] });
    }

    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);

    if (!channel) {
      return message.reply({
        content: "Le salon spécifié est invalide, oh. Vérifie bien wa.",
      });
    }

    guildSettings.announceChannel = channel.id;
    await guildSettings.save();

    return message.reply({
      content: `Le salon d'annonce a été configuré sur : <#${channel.id}>.`,
    });
  },

  // ————————————————————————————————————————
  // SLASH VERSION (setup salon uniquement)
  // ————————————————————————————————————————
  async runInteraction(client, interaction, guildSettings) {
    const channel = interaction.options.getChannel("salon");

    guildSettings.announceChannel = channel.id;
    await guildSettings.save();

    return interaction.reply({
      content: `Le salon d'annonce est maintenant défini sur : <#${channel.id}>. Ahh vwément, là c'est carré oh !`,
      flags: MessageFlags.Ephemeral
    });
  },
};
