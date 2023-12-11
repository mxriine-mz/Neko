const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'say',
    category: 'fun',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: false,
    usage: 'say <message>',
    examples: ['say Hello World!'],
    description: 'Repète le message envoyé',

    run: async (client, message, args, guildSettings, userSettings) => {
        message.channel.send(message.content.slice(5));
    },

    options: [
        {
            name: 'message',
            description: 'Le message à répéter',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const message = interaction.options.getString('message');

        interaction.reply(message);

    },
};