const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'remove_xp',
  category: 'level',
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: false,
  usage: 'remove_xp <@user> <amount>',
  examples: ['remove_xp @user 100'],
  description: 'Add xp to a user',

  run: async (client, message, args, guildSettings, userSettings) => {

    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if (!user) return message.reply('Merci de mentionner un utilisateur valide!');

    let amount = parseInt(args[1]);
    if (isNaN(amount)) return message.reply('Merci de spécifier un nombre valide !');
    if (amount < 0) return message.reply('Merci de spécifier un nombre positif!');

    userSettings = await client.getUser(user);

    if (userSettings) {
      userSettings.xp = userSettings.xp - amount;
      await client.updateUser(user, { xp: userSettings.xp });
      userSettings = await client.getUser(user);
      message.reply(`Vous avez enlevé ${amount} xp à ${user}!`);
    } else {
      await client.createUser(user);
      userSettings = await client.getUser(user);

      message.reply(`L'utilisateur ${user} n'était pas dans la base de données, il a donc été ajouté, merci de retaper la commande!`);
    }

  },   

  options: [
    {
      name: 'user',
      type: ApplicationCommandOptionType.User,
      description: 'The user to add xp to',
      required: true,
    },
    {
      name: 'amount',
      type: ApplicationCommandOptionType.Integer,
      description: 'The amount of xp to add',
      required: true,
    },
  ],

  runInteraction: async (client, interaction, guildSettings, userSettings) => {

    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    if (userSettings) {
      userSettings.xp = userSettings.xp - amount;
      await client.updateUser(user, { xp: userSettings.xp });
      userSettings = await client.getUser(user);
      interaction.reply(`Vous avez enlvé ${amount} xp à ${user}!`);
    } else {
      await client.createUser(user);
      userSettings = await client.getUser(user);

      interaction.reply(`L'utilisateur ${user} n'était pas dans la base de données, il a donc été ajouté, merci de retaper la commande!`);
    }

  }
    
}
       