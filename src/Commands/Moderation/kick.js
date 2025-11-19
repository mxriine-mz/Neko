const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
require("dotenv").config();

module.exports = {
  name: "kick",
  category: "moderation",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: false,
  usage: "kick <@target> <raison>",
  examples: ["kick @.yumii spam", "kick @.yumii flood"],
  description: "Kick un utilisateur du serveur.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    const target = message.mentions.users.first();
    const targetMember = message.mentions.members.first();
    const reason = args.slice(1).join(" ");

    // → VALIDATIONS
    if (!target)
      return message.reply("Merci de mentionner un utilisateur à kick.");

    if (!targetMember)
      return message.reply("Impossible de récupérer ce membre.");

    if (target.id === message.author.id)
      return message.reply("Tu ne peux pas te kick toi-même.");

    if (target.id === client.user.id)
      return message.reply("Tu ne peux pas kick le bot.");

    if (!reason)
      return message.reply("Merci d'indiquer une raison.");

    if (!targetMember.kickable)
      return message.reply("Je ne peux pas kick cet utilisateur.");

    // → DM du membre expulsé
    try {
      await target.send({
        content: `🚪 Vous avez été **kick** du serveur **${message.guild.name}**.\n\`\`\`Raison : ${reason}\`\`\``,
      });
    } catch (_) {}

    // → Kick
    await targetMember.kick(reason);

    // → Embed de confirmation
    const raisonEmbed = new EmbedBuilder()
      .setColor("#ffb347")
      .setDescription(`**Raison du kick :** ${reason}`);

    message.channel.send({
      content: `**${target} a été kick.**`,
      embeds: [raisonEmbed],
    });

    // ——————————————————————————————————
    // LOGS
    // ——————————————————————————————————
    const logChannel =
      client.channels.cache.get(process.env.LOG_CHANNEL) ||
      client.channels.cache.get(process.env.LOG_ID);

    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Kick | ${target.tag}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "± Utilisateur kick :",
            value: `${target} \n *(\`${target.id}\`)*`,
            inline: true,
          },
          {
            name: "± Kick par :",
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
          text: `Utilisateur kick du serveur`,
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
      description: "Utilisateur à kick",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "raison",
      description: "Raison du kick",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  runInteraction: async (client, interaction, guildSettings, userSettings) => {
    const target = interaction.options.getUser("target");
    const targetMember = interaction.options.getMember("target");
    const reason = interaction.options.getString("raison");

    // → VALIDATIONS
    if (!targetMember)
      return interaction.reply({
        content: "Impossible de récupérer ce membre.",
        ephemeral: true,
      });

    if (target.id === interaction.user.id)
      return interaction.reply({
        content: "Tu ne peux pas te kick toi-même.",
        ephemeral: true,
      });

    if (target.id === client.user.id)
      return interaction.reply({
        content: "Tu ne peux pas kick le bot.",
        ephemeral: true,
      });

    if (!targetMember.kickable)
      return interaction.reply({
        content: "Je ne peux pas kick cet utilisateur.",
        ephemeral: true,
      });

    // → DM
    try {
      await target.send({
        content: `🚪 Vous avez été **kick** du serveur **${interaction.guild.name}**.\n\`\`\`Raison : ${reason}\`\`\``,
      });
    } catch (_) {}

    // → Kick
    await targetMember.kick(reason);

    // → Confirmation
    const raisonEmbed = new EmbedBuilder()
      .setColor("#ffb347")
      .setDescription(`**Raison du kick :** ${reason}`);

    await interaction.reply({
      content: `**${target} a été kick.**`,
      embeds: [raisonEmbed],
    });

    // ——————————————————————————————————
    // LOGS
    // ——————————————————————————————————
    const logChannel =
      client.channels.cache.get(process.env.LOG_CHANNEL) ||
      client.channels.cache.get(process.env.LOG_ID);

    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Kick | ${target.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "± Utilisateur kick :",
            value: `${target} \n *(\`${target.id}\`)*`,
            inline: true,
          },
          {
            name: "± Kick par :",
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
          text: `Utilisateur kick du serveur`,
          iconURL: target.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      logChannel.send({ embeds: [logEmbed] });
    }
  },
};
