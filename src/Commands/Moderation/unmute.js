const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "unmute",
  category: "moderation",
  permissions: PermissionFlagsBits.ModerateMembers,
  ownerOnly: false,
  usage: "unmute <@target>",
  examples: ["unmute @.yumii"],
  description: "Unmute un utilisateur du serveur.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    const target = message.mentions.users.first();
    const targetMember = message.mentions.members.first();

    // Vérifications
    if (!target)
      return message.reply("Merci de mentionner un utilisateur à unmute.");

    if (!targetMember)
      return message.reply("Impossible de récupérer ce membre.");

    if (!targetMember.moderatable)
      return message.reply("Je ne peux pas gérer la modération sur cet utilisateur.");

    if (!targetMember.isCommunicationDisabled())
      return message.reply(
        "Cet utilisateur **n'est pas mute**, je ne peux pas l'unmute."
      );

    // Unmute
    try {
      await targetMember.timeout(null);
    } catch (err) {
      return message.reply(
        "Impossible d'unmute cet utilisateur (hiérarchie ou permissions manquantes)."
      );
    }

    // Confirmation
    await message.channel.send({
      content: `**${target} a été unmute.**`,
    });

    // Logs
    const logChannel =
      client.channels.cache.get(process.env.LOG_CHANNEL) ||
      client.channels.cache.get(process.env.LOG_ID);

    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Unmute | ${target.tag}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "± Utilisateur unmute :",
            value: `${target} \n *(\`${target.id}\`)*`,
            inline: true,
          },
          {
            name: "± Unmute par :",
            value: `${message.author} \n *(\`${message.author.id}\`)*`,
            inline: true,
          },
          {
            name: "± Date :",
            value: `\`${new Date().toLocaleString()}\``,
            inline: false,
          }
        )
        .setFooter({
          text: "Utilisateur unmute",
          iconURL: target.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      logChannel.send({ embeds: [logEmbed] });
    }
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [
    {
      name: "target",
      description: "Utilisateur à unmute",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  runInteraction: async (client, interaction, guildSettings, userSettings) => {
    const target = interaction.options.getUser("target");
    const targetMember = interaction.options.getMember("target");

    if (!target)
      return interaction.reply({
        content: "Merci de mentionner un utilisateur à unmute.",
        ephemeral: true,
      });

    if (!targetMember)
      return interaction.reply({
        content: "Impossible de récupérer ce membre.",
        ephemeral: true,
      });

    if (!targetMember.moderatable)
      return interaction.reply({
        content: "Je ne peux pas gérer la modération sur cet utilisateur.",
        ephemeral: true,
      });

    if (!targetMember.isCommunicationDisabled())
      return interaction.reply({
        content: "Cet utilisateur **n'est pas mute**, je ne peux pas l'unmute.",
        ephemeral: true,
      });

    // Unmute
    try {
      await targetMember.timeout(null);
    } catch (err) {
      return interaction.reply({
        content:
          "Impossible d'unmute cet utilisateur (hiérarchie ou permissions manquantes).",
        ephemeral: true,
      });
    }

    // Confirmation
    await interaction.reply({
      content: `**${target} a été unmute.**`,
      ephemeral: false,
    });

    // Logs
    const logChannel =
      client.channels.cache.get(process.env.LOG_CHANNEL) ||
      client.channels.cache.get(process.env.LOG_ID);

    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Unmute | ${target.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "± Utilisateur unmute :",
            value: `${target} \n *(\`${target.id}\`)*`,
            inline: true,
          },
          {
            name: "± Unmute par :",
            value: `${interaction.user} \n *(\`${interaction.user.id}\`)*`,
            inline: true,
          },
          {
            name: "± Date :",
            value: `\`${new Date().toLocaleString()}\``,
            inline: false,
          }
        )
        .setFooter({
          text: "Utilisateur unmute",
          iconURL: target.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      logChannel.send({ embeds: [logEmbed] });
    }
  },
};
