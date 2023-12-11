const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const feedgif = require('../../Assets/Gif_.Anime/feed.json');

module.exports = {
    name: 'feed',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'feed <user>',
    examples: ['feed @yumii', 'feed'],
    description: 'Nourrir quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const feed = feedgif[Math.floor(Math.random() * feedgif.length)];

        const embed = {
            description: `🍖 **${message.author.username}** nourri **${user.username}** *!*`,
            image: {
                url: feed,
            },
            timestamp: new Date(),
            footer : {
                text: `Feed`,
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

        const user = message.mentions.users.first() || client.user;

        const feed = feedgif[Math.floor(Math.random() * feedgif.length)];

        const embed = {
            description: `🍖 **${interaction.user.username}** nourri **${user.username}** *!*`,
            image: {
                url: feed,
            },
            timestamp: new Date(),
            footer : {
                text: `Feed`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};