const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const cookiegif = require('../../Assets/Gif_.Anime/cookie.json');

module.exports = {
    name: 'cookie',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'cookie <user>',
    examples: ['cookie @yumii', 'cookie'],
    description: 'Donenr un cookie à quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const cookie = cookiegif[Math.floor(Math.random() * cookiegif.length)];

        const embed = {
            description: `🍪 **${message.author}** donne un cookie à ${user.username} *!*`,
            image: {
                url: cookie,
            },
            timestamp: new Date(),
            footer : {
                text: `Cookie`,
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

        const cookie = cookiegif[Math.floor(Math.random() * cookiegif.length)];

        const embed = {
            description: `🍪 **${interaction.user.username}** donne un cookie à ${user.username} *!*`,
            image: {
                url: cookie,
            },
            timestamp: new Date(),
            footer : {
                text: `Cookie`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};