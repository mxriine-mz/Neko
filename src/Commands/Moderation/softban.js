const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "softban",
  category: "moderation",
  permissions: PermissionFlagsBits.BanMembers,
  ownerOnly: false,
  usage: "softban <@target> <jours> <raison>",
  examples: ["softban @.yumii 4 spam"],
  description: "Ban temporairement un utilisateur et supprime ses messages.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    const target = message.mentions.users.first();
    const targetMember = message.mentions.members.first();

    const days = parseInt(args[1], 10);
    const reason = args.slice(2).join(" ");

    if (!target)
      return message.reply("Merci de mentionner un utilisateur à softban.");

    if (!targetMember)
      return message.reply("Impossible de récupérer ce membre.");

    if (!targetMember.bannable)
      return message.reply("Je ne peux pas bannir cet utilisateur.");

    if (isNaN(days) || days < 1 || days > 7)
      return message.reply("La durée doit être comprise entre **1 et 7 jours**.");

    if (!reason)
      return message.reply("Merci d'indiquer une raison.");

    // DM
    try {
      await target.send({
        content: `🔨 Vous avez été **softban** du serveur **${message.guild.name}**.\n\`\`\`Durée : ${days} jours\nRaison : ${reason}\`\`\``,
      });
    } catch (_) {}

    // BAN (supprime X jours)
    await targetMember.ban({
      deleteMessageDays: days,
      reason: reason,
    });

    // UNBAN = SOFTBAN
    await message.guild.members.unban(target.id, "Softban (unban immédiat)");

    // Confirmation message
    const raisonEmbed = new EmbedBuilder()
      .setColor("#ff4444")
      .setDescription(`**Raison du softban :** ${reason}`);

    message.channel.send({
      content: `**${target} a été softban (${days} jours).**`,
      embeds: [raisonEmbed],
    });

    // LOGS
    const logChannel =
      client.channels.cache.get(process.env.LOG_CHANNEL) ||
      client.channels.cache.get(process.env.LOG_ID);

    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Softban | ${target.tag}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "Utilisateur softban :",
            value: `${target} \n (\`${target.id}\`)`,
            inline: true,
          },
          {
            name: "Softban par :",
            value: `${message.author} \n (\`${message.author.id}\`)`,
            inline: true,
          },
          {
            name: "Raison :",
            value: reason,
            inline: true,
          },
          {
            name: "Suppression messages :",
            value: `${days} jours`,
            inline: true,
          },
          {
            name: "Date :",
            value: `\`${new Date().toLocaleString()}\``,
            inline: true,
          }
        )
        .setFooter({
          text: "Softban appliqué",
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
      description: "Utilisateur à softban",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "jours",
      description: "Nombre de jours de messages à supprimer (1–7)",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "raison",
      description: "Raison du softban",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  runInteraction: async (client, interaction, guildSettings, userSettings) => {
    const target = interaction.options.getUser("target");
    const targetMember = interaction.options.getMember("target");
    const days = interaction.options.getInteger("jours");
    const reason = interaction.options.getString("raison");

    if (!targetMember)
      return interaction.reply({
        content: "Impossible de récupérer ce membre.",
        ephemeral: true,
      });

    if (!targetMember.bannable)
      return interaction.reply({
        content: "Je ne peux pas bannir cet utilisateur.",
        ephemeral: true,
      });

    if (days < 1 || days > 7)
      return interaction.reply({
        content: "La durée doit être entre **1 et 7 jours**.",
        ephemeral: true,
      });

    // DM
    try {
      await target.send({
        content: `🔨 Vous avez été **softban** du serveur **${interaction.guild.name}**.\n\`\`\`Durée : ${days} jours\nRaison : ${reason}\`\`\``,
      });
    } catch (_) {}

    // BAN (delete X days)
    await targetMember.ban({
      deleteMessageDays: days,
      reason: reason,
    });

    // UNBAN
    await interaction.guild.members.unban(target.id, "Softban (unban immédiat)");

    // Confirmation
    const raisonEmbed = new EmbedBuilder()
      .setColor("#ff4444")
      .setDescription(`**Raison du softban :** ${reason}`);

    await interaction.reply({
      content: `**${target} a été softban (${days} jours).**`,
      embeds: [raisonEmbed],
    });

    // Logs
    const logChannel =
      client.channels.cache.get(process.env.LOG_CHANNEL) ||
      client.channels.cache.get(process.env.LOG_ID);

    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Softban | ${target.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "Utilisateur softban :",
            value: `${target} \n (\`${target.id}\`)`,
            inline: true,
          },
          {
            name: "Softban par :",
            value: `${interaction.user} \n (\`${interaction.user.id}\`)`,
            inline: true,
          },
          {
            name: "Raison :",
            value: reason,
            inline: true,
          },
          {
            name: "Suppression messages :",
            value: `${days} jours`,
            inline: true,
          },
          {
            name: "Date :",
            value: `\`${new Date().toLocaleString()}\``,
            inline: true,
          }
        )
        .setFooter({
          text: "Softban appliqué",
          iconURL: target.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      logChannel.send({ embeds: [logEmbed] });
    }
  },
};
