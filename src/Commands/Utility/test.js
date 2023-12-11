const { PermissionFlagsBits, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  name: 'test',
  category: 'utility',
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: false,
  usage: 'test',
  examples: ['test'],
  description: 'Oui bon entendeur',

  run: async (client, message, args, guildSettings, userSettings) => {

      console.log(userSettings)

    }      
    
}
        