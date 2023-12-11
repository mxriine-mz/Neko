const { PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
const { readFile } = require('fs/promises');


module.exports = {
  name: 'rank',
  category: 'level',
  permissions: PermissionFlagsBits.ViewChannel,
  ownerOnly: false,
  usage: 'rank',
  examples: ['rank'],
  description: 'Oui bon entendeur',

  run: async (client, message, args, guildSettings, userSettings) => {

    
  },

  runInteraction: async (client, interaction, guildSettings, userSettings) => {


  }
    
}
       