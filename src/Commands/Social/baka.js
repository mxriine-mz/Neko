const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const bakagif = require('../../Assets/Gif_.Anime/baka.json');

module.exports = {
    name: 'baka',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'baka <user>',
    examples: ['baka @yumii', 'baka'],
    description: 'Dire baka à quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || message.author;

        const baka = bakagif[Math.floor(Math.random() * bakagif.length)];

        const embed = {
            description: `**${user.username}** est baka *!*`,
            image: {
                url: baka,
            },
            timestamp: new Date(),
            footer : {
                text: `Baka`,
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

        const user = interaction.options.getUser('user') || interaction.user;

        const baka = bakagif[Math.floor(Math.random() * bakagif.length)];

        const embed = {
            description: `**${user.username}** est baka *!*`,
            image: {
                url: baka,
            },
            timestamp: new Date(),
            footer : {
                text: `Baka`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};