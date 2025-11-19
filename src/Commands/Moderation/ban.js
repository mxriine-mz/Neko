const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "ban",
  category: "moderation",
  permissions: PermissionFlagsBits.BanMembers,
  ownerOnly: false,
  usage: "ban <@target> <raison>",
  examples: ["ban @.yumii spam", "ban @.yumii flood"],
  description: "Ban un utilisateur du serveur.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    const target = message.mentions.users.first();
    const targetMember = message.mentions.members.first();
    const reason = args.slice(1).join(" ");

    // ————————————————
    // Validations
    // ————————————————
    if (!target)
      return message.reply("Merci de mentionner un utilisateur à ban.");

    if (!targetMember)
      return message.reply("Impossible de récupérer le membre mentionné.");

    if (!targetMember.bannable)
      return message.reply("Je ne peux pas bannir cet utilisateur.");

    if (!reason)
      return message.reply("Merci de fournir une raison pour le ban.");

    if (target.id === message.author.id)
      return message.reply("Tu ne peux pas te bannir toi-même.");

    if (target.id === client.user.id)
      return message.reply("Tu ne peux pas bannir le bot.");

    // ————————————————
    // DM de l’utilisateur
    // ————————————————
    try {
      await target.send({
        content: `🚫 Vous avez été **banni** du serveur **${message.guild.name}**.\n\`\`\`Raison : ${reason}\`\`\``,
      });
    } catch (_) {}

    // ————————————————
    // BAN
    // ————————————————
    await targetMember.ban({ reason });

    // ————————————————
    // Embed de confirmation
    // ————————————————
    const raisonEmbed = new EmbedBuilder()
      .setColor("#ff6666")
      .setDescription(`**Raison du ban :** ${reason}`);

    await message.channel.send({
      content: `**${target} a été banni**.`,
      embeds: [raisonEmbed],
    });

    // ————————————————
    // Logs
    // ————————————————
    const logChannel =
      client.channels.cache.get(process.env.LOG_CHANNEL) ||
      client.channels.cache.get(process.env.LOG_ID);

    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Ban | ${target.tag}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "± Utilisateur banni :",
            value: `${target} \n *(\`${target.id}\`)*`,
            inline: true,
          },
          {
            name: "± Banni par :",
            value: `${message.author} \n *(\`${message.author.id}\`)*`,
            inline: true,
          },
          {
            name: "± Raison :",
            value: reason,
            inline: false,
          },
          {
            name: "± Date :",
            value: `\`${new Date().toLocaleString()}\``,
            inline: true,
          }
        )
        .setFooter({
          text: `Utilisateur banni`,
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
      description: "Utilisateur à bannir",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "raison",
      description: "Raison du ban",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  runInteraction: async (client, interaction) => {
    const target = interaction.options.getUser("target");
    const targetMember = interaction.options.getMember("target");
    const reason = interaction.options.getString("raison");

    // Validations
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

    if (target.id === interaction.user.id)
      return interaction.reply({
        content: "Tu ne peux pas te bannir toi-même.",
        ephemeral: true,
      });

    if (target.id === client.user.id)
      return interaction.reply({
        content: "Tu ne peux pas bannir le bot.",
        ephemeral: true,
      });

    // DM
    try {
      await target.send({
        content: `🚫 Vous avez été **banni** du serveur **${interaction.guild.name}**.\n\`\`\`Raison : ${reason}\`\`\``,
      });
    } catch (_) {}

    // BAN
    await targetMember.ban({ reason });

    // Confirmation
    const raisonEmbed = new EmbedBuilder()
      .setColor("#ff6666")
      .setDescription(`**Raison du ban :** ${reason}`);

    await interaction.reply({
      content: `**${target} a été banni**.`,
      embeds: [raisonEmbed],
      ephemeral: false,
    });

    // Logs
    const logChannel =
      client.channels.cache.get(process.env.LOG_CHANNEL) ||
      client.channels.cache.get(process.env.LOG_ID);

    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Ban | ${target.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "± Utilisateur banni :",
            value: `${target} \n *(\`${target.id}\`)*`,
            inline: true,
          },
          {
            name: "± Banni par :",
            value: `${interaction.user} \n *(\`${interaction.user.id}\`)*`,
            inline: true,
          },
          {
            name: "± Raison :",
            value: reason,
            inline: false,
          },
          {
            name: "± Date :",
            value: `\`${new Date().toLocaleString()}\``,
            inline: true,
          }
        )
        .setFooter({
          text: `Utilisateur banni`,
          iconURL: target.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      logChannel.send({ embeds: [logEmbed] });
    }
  },
};
