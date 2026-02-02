const { PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
  name: "vocal",
  category: "utility",
  permissions: PermissionFlagsBits.SendMessages,
  ownerOnly: false,
  usage: "vocal <action>",
  examples: ["vocal rename Chill", "vocal limit 4"],
  description: "Gère ton salon vocal (rename, limit, lock, unlock, kick).",

  // ——————————————————————————
  // OPTIONS SLASH : SUBCOMMANDS
  // ——————————————————————————
  options: [
    {
      name: "rename",
      description: "Renomme ton salon vocal.",
      type: 1, // SUB_COMMAND
      options: [
        {
          name: "nom",
          description: "Nouveau nom du salon",
          type: 3, // STRING
          required: true
        }
      ]
    },
    {
      name: "limit",
      description: "Définit une limite d'utilisateurs.",
      type: 1, // SUB_COMMAND
      options: [
        {
          name: "nombre",
          description: "Nombre maximum d'utilisateurs",
          type: 4, // INTEGER
          required: true,
          min_value: 1,
          max_value: 99
        }
      ]
    },
    {
      name: "lock",
      description: "Verrouille ton salon (personne ne peut entrer).",
      type: 1 // SUB_COMMAND
    },
    {
      name: "unlock",
      description: "Déverrouille ton salon (ouvert à tous).",
      type: 1 // SUB_COMMAND
    },
    {
      name: "kick",
      description: "Expulse un membre de ton salon vocal.",
      type: 1,
      options: [
        {
          name: "membre",
          description: "Membre à expulser du salon",
          type: 6, // USER
          required: true
        }
      ]
    }
  ],

  // ——————————————————————————
  // PREFIX COMMAND (optionnel)
  // ——————————————————————————
  run: async (client, message, args) => {
    return message.reply("Cette commande s'utilise en slash. Fais `/vocal` !");
  },

  // ——————————————————————————
  // SLASH COMMAND
  // ——————————————————————————
  runInteraction: async (client, interaction, guildSettings, userSettings) => {
    const member = interaction.member;
    const channel = member.voice.channel;

    // Vérification présence dans un vocal
    if (!channel)
      return interaction.reply({ 
        content: "Tu n'es pas dans un salon vocal oh !", 
        flags: MessageFlags.Ephemeral 
      });

    // Vérification propriétaire
    const perms = channel.permissionsFor(member);
    if (!perms?.has(PermissionFlagsBits.ManageChannels))
      return interaction.reply({ 
        content: "Tchuuuiiip ! Ce n'est même pas ton salon.", 
        flags: MessageFlags.Ephemeral 
      });

    const sub = interaction.options.getSubcommand();

    // ————————————————
    // RENAME
    // ————————————————
    if (sub === "rename") {
      const newName = interaction.options.getString("nom");
      await channel.setName(`・ ${newName}`);
      return interaction.reply({
        content: "Nom du salon mis à jour ✨",
        flags: MessageFlags.Ephemeral
      });
    }

    // ————————————————
    // LIMIT
    // ————————————————
    if (sub === "limit") {
      const limit = interaction.options.getInteger("nombre");
      await channel.setUserLimit(limit);
      return interaction.reply({
        content: `Limite d'utilisateur mise à **${limit}**.`,
        flags: MessageFlags.Ephemeral
      });
    }

    // ————————————————
    // LOCK
    // ————————————————
    if (sub === "lock") {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        Connect: false
      });
      return interaction.reply({
        content: "Salon verrouillé 🔒",
        flags: MessageFlags.Ephemeral
      });
    }

    // ————————————————
    // UNLOCK
    // ————————————————
    if (sub === "unlock") {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        Connect: true
      });
      return interaction.reply({
        content: "Salon déverrouillé 🔓",
        flags: MessageFlags.Ephemeral
      });
    }

    // ————————————————
    // KICK
    // ————————————————
    if (sub === "kick") {
      const user = interaction.options.getUser("membre");
      const targetMember = channel.members.get(user.id);

      if (!targetMember)
        return interaction.reply({
          content: "Ce membre n'est pas dans ton vocal…",
          flags: MessageFlags.Ephemeral
        });

      await targetMember.voice.disconnect();
      return interaction.reply({
        content: `${user.username} a été expulsé 👋`,
        flags: MessageFlags.Ephemeral
      });
    }
  }
};
