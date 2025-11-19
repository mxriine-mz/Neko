const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "announce",
  category: "administration",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: true,
  usage: ["announce [true|false]", "announce [channel] <channel>"],
  examples: ["announce true", "announce channel #channel"],
  description: "Active/désactive les annonces join/leave et configure le salon associé.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    const prefix = guildSettings.prefix; // DB prefix ONLY

    // —————————————————————————————————
    // EMBED D'AIDE SI ARGUMENT MANQUANT
    // —————————————————————————————————
    if (!args[0] || !/^(true|false|channel)$/i.test(args[0])) {
      const usage = client.commands
        .filter((cmd) => cmd.name === "announce")
        .map((cmd) => cmd.usage.join("\n"))
        .join("");

      const examples = client.commands
        .filter((cmd) => cmd.name === "announce")
        .map((cmd) => cmd.examples.join(" | "))
        .join("");

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Neko`,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle("Visualisation de la commande Announce")
        .setDescription(
          `>>> Active/désactive les annonces avec \`true\` ou \`false\` *(par défaut désactivé)*\nConfigure le channel d'annonce avec \`channel\` + le salon.`
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
        .setColor("#ff8ccf");

      return message.reply({ embeds: [embed] });
    }

    // —————————————————————————————————
    // ACTIVER LES ANNONCES
    // —————————————————————————————————
    if (args[0] === "true") {
      guildSettings.announce = true;
      await guildSettings.save();

      return message.reply({
        content: `**${message.author.username}**, les annonces ont été **activées**.\nConfigure le salon avec \`${prefix}announce channel\``,
      });
    }

    // —————————————————————————————————
    // DÉSACTIVER LES ANNONCES
    // —————————————————————————————————
    if (args[0] === "false") {
      guildSettings.announce = false;
      await guildSettings.save();

      return message.reply({
        content: `**${message.author.username}**, les annonces ont été **désactivées**.`,
      });
    }

    // —————————————————————————————————
    // CONFIGURER LE CHANNEL
    // —————————————————————————————————
    if (args[0] === "channel") {
      const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]);

      if (!channel) {
        return message.reply({
          content: `**${message.author.username}**, merci de mentionner un salon valide.`,
        });
      }

      guildSettings.announceChannel = channel.id;
      await guildSettings.save();

      return message.reply({
        content: `**${message.author.username}**, le salon d'annonce est maintenant : <#${channel.id}>.\nTu peux configurer le message d'annonce avec \`${prefix}announce message\` (si tu as un système de message custom).`,
      });
    }
  },

  // ————————————————————————————————————————
  // SLASH VERSION (vide, tu n’en as pas besoin)
  // ————————————————————————————————————————
  async runInteraction(client, interaction, guildSettings) {
    return interaction.reply({
      content: "Cette commande n'est pas encore disponible en slash.",
      ephemeral: true,
    });
  },
};
