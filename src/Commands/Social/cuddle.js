const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const cuddlegif = require('../../Assets/Gif_.Anime/cuddle.json');

module.exports = {
    name: 'cuddle',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'cuddle <user>',
    examples: ['cuddle @yumii', 'cuddle'],
    description: 'Câliner quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const cuddle = cuddlegif[Math.floor(Math.random() * cuddlegif.length)];

        const embed = {
            description: `**${user.username}**, tu as un câlin de **${message.author.username}** *!*`,
            image: {
                url: cuddle,
            },
            timestamp: new Date(),
            footer : {
                text: `Cuddle`,
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

        const cuddle = cuddlegif[Math.floor(Math.random() * cuddlegif.length)];

        const embed = {
            description: `**${user.username}**, tu as un câlin de **${interaction.user.username}** *!*`,
            image: {
                url: cuddle,
            },
            timestamp: new Date(),
            footer : {
                text: `Cuddle`,
            },
        }

        message.channel.send({ embeds: [embed] });

    },
};