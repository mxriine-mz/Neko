const {
  ApplicationCommandType,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "User Info",
  category: "commandmenuusers",
  type: ApplicationCommandType.User,
  ownerOnly: false,
  description: "",

  runInteraction: async (client, interaction) => {

    // Récupération du membre
    let member;
    try {
      member = await interaction.guild.members.fetch(interaction.targetId);
    } catch {
      return interaction.reply({
        content: "Impossible de récupérer cet utilisateur.",
        ephemeral: true,
      });
    }

    // Si vraiment introuvable
    if (!member) {
      return interaction.reply({
        content: "Utilisateur introuvable sur ce serveur.",
        ephemeral: true,
      });
    }

    // Détection du statut "modérateur"
    const isModerator =
      member.permissions.has(PermissionFlagsBits.KickMembers) ||
      member.permissions.has(PermissionFlagsBits.BanMembers) ||
      member.permissions.has(PermissionFlagsBits.ManageMessages);

    // Roles lisibles
    const roleList = member.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .map(r => r.toString());

    const roles =
      roleList.length > 0
        ? (roleList.length > 10
            ? roleList.slice(0, 10).join(", ") + ` … (+${roleList.length - 10})`
            : roleList.join(", "))
        : "Aucun rôle";

    const embed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setAuthor({
        name: `${member.user.tag}`,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "ID",
          value: member.id,
        },
        {
          name: "Création du compte",
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:f> • <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
        },
        {
          name: "Rejoint le serveur",
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:f> • <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        },
        {
          name: "Modérateur",
          value: isModerator ? "Oui" : "Non",
          inline: true,
        },
        {
          name: "Bot",
          value: member.user.bot ? "Oui" : "Non",
          inline: true,
        },
        {
          name: `Rôles (${roleList.length})`,
          value: roles,
        }
      )
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
