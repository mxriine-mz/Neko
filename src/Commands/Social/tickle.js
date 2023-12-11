const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ticklegif = require('../../Assets/Gif_.Anime/tickle.json');

module.exports = {
    name: 'tickle',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'tickle <user>',
    examples: ['tickle @yumii', 'tickle'],
    description: 'Prendre quelqu\'un dans ses bras',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const tickle = ticklegif[Math.floor(Math.random() * ticklegif.length)];

        const embed = {
            description: `**${message.author.username}** chatouille **${user.username}** *!*`,
            image: {
                url: tickle,
            },
            timestamp: new Date(),
            footer : {
                text: `Tickle`,
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

        const tickle = ticklegif[Math.floor(Math.random() * ticklegif.length)];

        const embed = {
            description: `**${interaction.user.username}** chatouille **${user.username}** *!*`,
            image: {
                url: tickle,
            },
            timestamp: new Date(),
            footer : {
                text: `Tickle`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};