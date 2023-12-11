const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const huggif = require('../../Assets/Gif_.Anime/hug.json');

module.exports = {
    name: 'hug',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'hug <user>',
    examples: ['hug @yumii', 'hug'],
    description: 'Prendre quelqu\'un dans ses bras',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const hug = huggif[Math.floor(Math.random() * huggif.length)];

        const embed = {
            description: `🤗 **${message.author.username}** fait un calîn à **${user.username}** *!*`,
            image: {
                url: hug,
            },
            timestamp: new Date(),
            footer : {
                text: `Hug`,
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

        const hug = huggif[Math.floor(Math.random() * huggif.length)];

        const embed = {
            description: `🤗 **${interaction.user.username}** fait un calîn à **${user.username}** *!*`,
            image: {
                url: hug,
            },
            timestamp: new Date(),
            footer : {
                text: `Hug`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};