const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "logs",
  category: "administration",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: true,
  usage: ["logs [true|false]", "logs [channel] <channel>"],
  examples: ["logs true", "logs channel #channel"],
  description: "Active/désactive les logs et configure le salon des logs.",

  // ————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    const prefix = guildSettings.prefix; // prefix uniquement DB

    // Aide si aucun argument ou argument invalide
    if (!args[0] || !/^(true|false|channel)$/i.test(args[0])) {
      const usage = client.commands
        .filter((cmd) => cmd.name === "logs")
        .map((cmd) => cmd.usage.join("\n"))
        .join("");

      const examples = client.commands
        .filter((cmd) => cmd.name === "logs")
        .map((cmd) => cmd.examples.join(" | "))
        .join("");

      const embed = new EmbedBuilder()
        .setAuthor({
          name: "Neko",
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle("Visualisation de la commande Logs")
        .setDescription(
          [
            ">>> Active/désactive les logs avec `true` ou `false` *(par défaut désactivé)*.",
            "Configure le salon des logs avec `channel` + le nom ou la mention du salon.",
          ].join("\n")
        )
        .addFields(
          {
            name: "Utilisation",
            value: `\`${usage}\``,
            inline: false,
          },
          {
            name: "Exemples",
            value: `\`\`\`${examples}\`\`\``,
            inline: false,
          }
        )
        .setColor("#ffcc88");

      return message.reply({ embeds: [embed] });
    }

    const sub = args[0].toLowerCase();

    // Activer les logs
    if (sub === "true") {
      guildSettings.logs = true;
      await guildSettings.save();

      return message.reply({
        content: `**${message.author.username}**, les logs ont été **activées**.\nMerci de définir le salon de logs avec la commande \`${prefix}logs channel\`.`,
      });
    }

    // Désactiver les logs
    if (sub === "false") {
      guildSettings.logs = false;
      await guildSettings.save();

      return message.reply({
        content: `**${message.author.username}**, les logs ont été **désactivées**.`,
      });
    }

    // Configuration du salon
    if (sub === "channel") {
      const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]);

      if (!channel) {
        return message.reply({
          content: `**${message.author.username}**, merci de mentionner un salon valide.`,
        });
      }

      guildSettings.logsChannel = channel.id;
      await guildSettings.save();

      return message.reply({
        content: `**${message.author.username}**, le salon des logs a été configuré avec succès. C'est maintenant : <#${channel.id}>`,
      });
    }
  },

  // ————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————
  options: [
    {
      name: "channel",
      description: "Salon de logs à utiliser",
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],

  async runInteraction(client, interaction, guildSettings) {
    const channel = interaction.options.getChannel("channel");

    // Si un salon est fourni → on met à jour
    if (channel) {
      guildSettings.logsChannel = channel.id;
      await guildSettings.save();

      return interaction.reply({
        content: `**${interaction.user.username}**, le salon de log a été sauvegardé avec succès, c'est maintenant : <#${channel.id}>`,
        ephemeral: true,
      });
    }

    // Sinon → on affiche le salon actuel
    if (guildSettings.logsChannel) {
      return interaction.reply({
        content: `**${interaction.user.username}**, le salon de log actuel pour ce serveur est : <#${guildSettings.logsChannel}>`,
        ephemeral: true,
      });
    }

    // Si rien n'est configuré
    return interaction.reply({
      content: `**${interaction.user.username}**, aucun salon de logs n'est configuré pour ce serveur.`,
      ephemeral: true,
    });
  },
};
