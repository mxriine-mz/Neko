const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "clear",
  category: "moderation",
  permissions: PermissionFlagsBits.ManageMessages,
  ownerOnly: false,
  usage: "clear <nombre> <@target>",
  examples: ["clear 10", "clear 100 @.yumii"],
  description: "Supprime un nombre de messages spécifié, optionnellement ciblés.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    if (!message.member.permissions.has("ManageMessages"))
      return message.reply("Tu n'as pas la permission de gérer les messages.");

    if (!message.guild.members.me.permissions.has("ManageMessages"))
      return message.reply("Je n'ai pas la permission de gérer les messages.");

    const amountRaw = args[0];
    const amount = parseInt(amountRaw, 10);

    if (!amount || amount < 1 || amount > 100) {
      return message.channel.send(
        "Le nombre doit être **entre 1 et 100**."
      );
    }

    const target = message.mentions.users.first();

    // On supprime la commande elle-même
    try {
      await message.delete();
    } catch (_) {}

    // Fetch des messages (max 100)
    const messages = await message.channel.messages.fetch({ limit: 100 });

    // —————————————————————————————————
    // MODE AVEC TARGET
    // —————————————————————————————————
    if (target) {
      let i = 0;
      const toDelete = [];

      for (const msg of messages.values()) {
        if (msg.author.id === target.id && i < amount) {
          toDelete.push(msg);
          i++;
        }
      }

      await message.channel.bulkDelete(toDelete, true);

      return message.channel
        .send(`Suppression de ${i} messages de **${target.username}**`)
        .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 5000));
    }

    // —————————————————————————————————
    // MODE NORMAL
    // —————————————————————————————————
    await message.channel.bulkDelete(amount, true);

    return message.channel
      .send(`Suppression de **${amount}** messages.`)
      .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 5000));
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [
    {
      name: "nombre",
      description: "Nombre de messages à supprimer (1–100)",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "target",
      description: "Supprimer uniquement les messages de cet utilisateur",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
    {
      name: "message",
      description: "ID d'un message précis à supprimer",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  runInteraction: async (client, interaction) => {
    if (!interaction.member.permissions.has("ManageMessages")) {
      return interaction.reply({
        content: "Tu n'as pas la permission de gérer les messages.",
        ephemeral: true,
      });
    }

    if (!interaction.guild.members.me.permissions.has("ManageMessages")) {
      return interaction.reply({
        content: "Je n'ai pas la permission de gérer les messages.",
        ephemeral: true,
      });
    }

    const amount = interaction.options.getInteger("nombre");
    const messageId = interaction.options.getString("message");
    const target = interaction.options.getUser("target");

    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: "Le nombre doit être entre **1 et 100**.",
        ephemeral: true,
      });
    }

    // —————————————————————————————————
    // Suppression par ID
    // —————————————————————————————————
    if (messageId) {
      try {
        const msg = await interaction.channel.messages.fetch(messageId);
        await msg.delete();

        return interaction.reply({
          content: `Message **${messageId}** supprimé.`,
          ephemeral: false,
        });
      } catch (e) {
        return interaction.reply({
          content: "Impossible de trouver ou supprimer ce message.",
          ephemeral: true,
        });
      }
    }

    // Fetch messages
    const messages = await interaction.channel.messages.fetch({ limit: 100 });

    // —————————————————————————————————
    // Avec target
    // —————————————————————————————————
    if (target) {
      let i = 0;
      const toDelete = [];

      for (const msg of messages.values()) {
        if (msg.author.id === target.id && i < amount) {
          toDelete.push(msg);
          i++;
        }
      }

      await interaction.channel.bulkDelete(toDelete, true);

      await interaction.reply({
        content: `Suppression de ${i} messages de **${target.username}**`,
        ephemeral: false,
      });

      return setTimeout(
        () => interaction.deleteReply().catch(() => {}),
        5000
      );
    }

    // —————————————————————————————————
    // Mode normal
    // —————————————————————————————————
    await interaction.channel.bulkDelete(amount, true);

    await interaction.reply({
      content: `Suppression de **${amount}** messages.`,
      ephemeral: false,
    });

    setTimeout(() => interaction.deleteReply().catch(() => {}), 5000);
  },
};
