const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "mute",
  category: "moderation",
  permissions: PermissionFlagsBits.ModerateMembers,
  ownerOnly: false,
  usage: "mute <@target> <durée> <raison>",
  examples: ["mute @.yumii 4 minutes spam"],
  description: "Mute un utilisateur temporairement.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    const target = message.mentions.users.first();
    const targetMember = message.mentions.members.first();

    if (!target)
      return message.reply("Merci de mentionner un utilisateur à mute.");
    if (!targetMember)
      return message.reply("Impossible de récupérer ce membre.");
    if (!targetMember.moderatable)
      return message.reply("Je ne peux pas mute cet utilisateur.");

    // Durée = 2 arguments : "4 minutes", "1h", "2d", etc
    const duration = `${args[1]} ${args[2] || ""}`.trim();
    const convertedTime = ms(duration);

    if (!duration || !convertedTime)
      return message.reply("Merci de spécifier une durée valide (ex: `4 minutes`).");

    const reason = args.slice(3).join(" ");
    if (!reason)
      return message.reply("Merci de spécifier une raison.");

    // DM
    try {
      await target.send({
        content: `🔇 Vous avez été **mute** dans **${message.guild.name}**.\n\`\`\`Durée : ${duration}\nRaison : ${reason}\`\`\``,
      });
    } catch (_) {}

    // APPLY MUTE
    await targetMember.timeout(convertedTime, reason);

    // Embed confirmation
    const raisonEmbed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setDescription(`**Raison du mute :** ${reason}`);

    await message.channel.send({
      content: `**${target} a été mute pour ${duration}.**`,
      embeds: [raisonEmbed],
    });

    // LOGS
    const logChannel =
      client.channels.cache.get(process.env.LOG_CHANNEL) ||
      client.channels.cache.get(process.env.LOG_ID);

    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Mute | ${target.tag}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "± Utilisateur mute :",
            value: `${target}\n*(\`${target.id}\`)*`,
            inline: true,
          },
          {
            name: "± Mute par :",
            value: `${message.author}\n*(\`${message.author.id}\`)*`,
            inline: true,
          },
          {
            name: "± Raison :",
            value: reason,
            inline: true,
          },
          {
            name: "± Durée :",
            value: duration,
            inline: true,
          },
          {
            name: "± Date :",
            value: `\`${new Date().toLocaleString()}\``,
            inline: true,
          }
        )
        .setFooter({
          text: "Utilisateur mute",
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
      description: "Utilisateur à mute",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "duration",
      description: "Durée du mute (ex: 10 minutes, 1h, 2d)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "raison",
      description: "Raison du mute",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  runInteraction: async (client, interaction, guildSettings, userSettings) => {
    const target = interaction.options.getUser("target");
    const targetMember = interaction.options.getMember("target");
    const duration = interaction.options.getString("duration");
    const reason = interaction.options.getString("raison");

    const convertedTime = ms(duration);

    if (!targetMember)
      return interaction.reply({
        content: "Impossible de récupérer ce membre.",
        ephemeral: true,
      });

    if (!convertedTime)
      return interaction.reply({
        content: "Merci d'indiquer une durée valide.",
        ephemeral: true,
      });

    if (!targetMember.moderatable)
      return interaction.reply({
        content: "Je ne peux pas mute cet utilisateur.",
        ephemeral: true,
      });

    // DM
    try {
      await target.send({
        content: `🔇 Vous avez été **mute** dans **${interaction.guild.name}**.\n\`\`\`Durée : ${duration}\nRaison : ${reason}\`\`\``,
      });
    } catch (_) {}

    // APPLY MUTE
    await targetMember.timeout(convertedTime, reason);

    // Confirm
    const raisonEmbed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setDescription(`**Raison du mute :** ${reason}`);

    await interaction.reply({
      content: `**${target} a été mute pour ${duration}.**`,
      embeds: [raisonEmbed],
    });

    // Logs
    const logChannel =
      client.channels.cache.get(process.env.LOG_CHANNEL) ||
      client.channels.cache.get(process.env.LOG_ID);

    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Mute | ${target.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "± Utilisateur mute :",
            value: `${target}\n*(\`${target.id}\`)*`,
            inline: true,
          },
          {
            name: "± Mute par :",
            value: `${interaction.user}\n*(\`${interaction.user.id}\`)*`,
            inline: true,
          },
          {
            name: "± Raison :",
            value: reason,
            inline: true,
          },
          {
            name: "± Durée :",
            value: duration,
            inline: true,
          },
          {
            name: "± Date :",
            value: `\`${new Date().toLocaleString()}\``,
            inline: true,
          }
        )
        .setFooter({
          text: "Utilisateur mute",
          iconURL: target.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      logChannel.send({ embeds: [logEmbed] });
    }
  },
};
