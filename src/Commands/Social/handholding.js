const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const handholdinggif = require('../../Assets/Gif_.Anime/handholding.json');

module.exports = {
    name: 'handholding',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'handholding <user>',
    examples: ['handholding @yumii', 'handholding'],
    description: 'Tenir la main de quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const handholding = handholdinggif[Math.floor(Math.random() * handholdinggif.length)];

        const embed = {
            description: `**${message.author.username}** tient la main de **${user.username}** *!*`,
            image: {
                url: handholding,
            },
            
            timestamp: new Date(),
            footer : {
                text: `Handholding`,
            },
        }

        message.channel.send({ embeds: [embed] });
    },

    options: [
        {
            name: 'user',
            description: 'Utilisateur avec qui interagir',
            type: ApplicationCommandOptionType.User,
            required: false,
        },
    ],

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const user = interaction.options.getUser('user') || client.user;

        const handholding = handholdinggif[Math.floor(Math.random() * handholdinggif.length)];

        const embed = {
            description: `**${interaction.user.username}** tient la main de **${user.username}** *!*`,
            image: {
                url: handholding,
            },
            timestamp: new Date(),
            footer : {
                text: `Handholding`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};