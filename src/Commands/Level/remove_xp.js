const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "remove_xp",
  category: "level",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: false,
  usage: "remove_xp <@user> <amount>",
  examples: ["remove_xp @user 100"],
  description: "Retire de l'XP à un utilisateur",

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

    // Si l'utilisateur n’existe pas en DB
    if (!userSettings) {
      await client.createUser(target);
      return message.reply(
        `L'utilisateur ${target} n'était pas dans la base de données. Il a été ajouté, merci de **retaper la commande** !`
      );
    }

    // Retrait XP
    const newXP = Math.max(0, userSettings.xp - amount);
    await client.updateUser(target, { xp: newXP });

    return message.reply(
      `Vous avez retiré **${amount} XP** à ${target} (nouveau total : **${newXP} XP**).`
    );
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.User,
      description: "L'utilisateur à qui retirer de l'XP",
      required: true,
    },
    {
      name: "amount",
      type: ApplicationCommandOptionType.Integer,
      description: "La quantité d'XP à retirer",
      required: true,
    },
  ],

  runInteraction: async (client, interaction, guildSettings, userSettings) => {
    const target = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");

    // Récupération settings
    let settings = await client.getUser(target);

    // Si pas dans DB
    if (!settings) {
      await client.createUser(target);
      return interaction.reply({
        content: `L'utilisateur ${target} n'était pas dans la base de données. Il a été ajouté, merci de **retaper la commande** !`,
        ephemeral: true,
      });
    }

    // Retrait XP
    const newXP = Math.max(0, settings.xp - amount);
    await client.updateUser(target, { xp: newXP });

    return interaction.reply({
      content: `Vous avez retiré **${amount} XP** à ${target} (nouveau total : **${newXP} XP**).`,
      ephemeral: false,
    });
  },
};
