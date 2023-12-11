const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const everyonegif = require('../../Assets/Gif_.Anime/everyone.json');

module.exports = {
    name: 'everyone',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'everyone <user>',
    examples: ['everyone @yumii', 'everyone'],
    description: 'Quelqu\'un ping everyone',

    run: async (client, message, args, guildSettings, userSettings) => {

        const everyone = everyonegif[Math.floor(Math.random() * everyonegif.length)];

        const embed = {
            description: `<:ping:1093571407096582224> Who pinged **@everyone** again *?*`,
            image: {
                url: everyone,
            },
            timestamp: new Date(),
            footer : {
                text: `Everyone`,
            },
        }

        message.channel.send({ embeds: [embed] });
    },

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const everyone = everyonegif[Math.floor(Math.random() * everyonegif.length)];

        const embed = {
            description: `<:ping:1093571407096582224> Who pinged **@everyone** again *?*`,
            image: {
                url: everyone,
            },
            timestamp: new Date(),
            footer : {
                text: `Everyone`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};