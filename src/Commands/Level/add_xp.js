const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "add_xp",
  category: "level",
  permissions: PermissionFlagsBits.KickMembers, // tu l'avais, je garde
  ownerOnly: false,
  usage: "add_xp <@user> <amount>",
  examples: ["add_xp @user 100"],
  description: "Ajoute de l'XP à un utilisateur.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args) => {
    // Récupération user
    const target =
      message.mentions.users.first() ||
      (args[0] && await client.users.fetch(args[0]).catch(() => null));

    if (!target) {
      return message.reply("Merci de mentionner un utilisateur valide !");
    }

    // Récupération amount
    const amount = parseInt(args[1]);
    if (isNaN(amount))
      return message.reply("Merci de spécifier un nombre valide !");
    if (amount < 0)
      return message.reply("Merci de spécifier un nombre positif !");

    // Récupération settings
    let userSettings = await client.getUser(target);

    // Si l'utilisateur n'est pas dans la DB
    if (!userSettings) {
      await client.createUser(target);
      return message.reply(
        `L'utilisateur ${target} n'était pas dans la base de données. Il a été ajouté, merci de **retaper la commande** !`
      );
    }

    // Ajout XP
    const newXP = userSettings.xp + amount;
    await client.updateUser(target, { xp: newXP });

    return message.reply(
      `Vous avez ajouté **${amount} XP** à ${target} (nouveau total : **${newXP} XP**).`
    );
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.User,
      description: "Utilisateur à qui ajouter de l'XP",
      required: true,
    },
    {
      name: "amount",
      type: ApplicationCommandOptionType.Integer,
      description: "Quantité d'XP à ajouter",
      required: true,
    },
  ],

  runInteraction: async (client, interaction) => {
    const target = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");

    // Récupération settings
    let userSettings = await client.getUser(target);

    // Si pas dans DB
    if (!userSettings) {
      await client.createUser(target);
      return interaction.reply(
        `L'utilisateur ${target} n'était pas dans la base de données. Il a été ajouté, merci de **retaper la commande** !`
      );
    }

    // Ajout XP
    const newXP = userSettings.xp + amount;
    await client.updateUser(target, { xp: newXP });

    return interaction.reply(
      `Vous avez ajouté **${amount} XP** à ${target} (nouveau total : **${newXP} XP**).`
    );
  },
};
