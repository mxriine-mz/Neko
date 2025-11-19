const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "levels",
  category: "level",
  permissions: PermissionFlagsBits.ViewChannel, // tu l’avais, je garde
  ownerOnly: false,
  usage: "levels",
  examples: ["levels"],
  description: "Affiche le classement complet des niveaux du serveur.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    // Récupération de TOUTES les données utilisateur
    const allUsers = await client.getUsers(); // Doit exister dans ton Loader
    if (!allUsers || allUsers.length === 0) {
      return message.reply("Aucun utilisateur dans la base de données.");
    }

    // Filtrer uniquement les users de CE serveur
    const guildUserIDs = message.guild.members.cache.map((m) => m.id);

    const guildUsers = allUsers.filter((u) => guildUserIDs.includes(u.userId));

    if (guildUsers.length === 0) {
      return message.reply("Aucun utilisateur de ce serveur n’a d’XP enregistré.");
    }

    // Tri du plus haut XP → plus bas
    guildUsers.sort((a, b) => b.xp - a.xp);

    // Génération du classement
    const rankingText = guildUsers
      .map((u, index) => {
        const user = message.guild.members.cache.get(u.userId);
        const name = user ? user.user.tag : `Utilisateur inconnu (${u.userId})`;
        return `**${index + 1}.** ${name} — \`${u.xp} XP\``;
      })
      .join("\n");

    // Embed
    const embed = new EmbedBuilder()
      .setColor("#202225")
      .setTitle("🏆 Classement général du serveur")
      .setDescription(rankingText)
      .setFooter({
        text: `Total: ${guildUsers.length} utilisateurs`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [],

  runInteraction: async (client, interaction, guildSettings, userSettings) => {
    const allUsers = await client.getUsers();
    if (!allUsers || allUsers.length === 0) {
      return interaction.reply({
        content: "Aucun utilisateur dans la base de données.",
        ephemeral: true,
      });
    }

    const guildUserIDs = interaction.guild.members.cache.map((m) => m.id);

    const guildUsers = allUsers.filter((u) => guildUserIDs.includes(u.userId));

    if (guildUsers.length === 0) {
      return interaction.reply({
        content: "Aucun utilisateur de ce serveur n’a d’XP enregistré.",
        ephemeral: true,
      });
    }

    guildUsers.sort((a, b) => b.xp - a.xp);

    const rankingText = guildUsers
      .map((u, index) => {
        const user = interaction.guild.members.cache.get(u.userId);
        const name = user ? user.user.tag : `Utilisateur inconnu (${u.userId})`;
        return `**${index + 1}.** ${name} — \`${u.xp} XP\``;
      })
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor("#202225")
      .setTitle("🏆 Classement général du serveur")
      .setDescription(rankingText)
      .setFooter({
        text: `Total: ${guildUsers.length} utilisateurs`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
