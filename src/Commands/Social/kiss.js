const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const kissgif = require('../../Assets/Gif_.Anime/kiss.json');

module.exports = {
    name: 'kiss',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'kiss <user>',
    examples: ['kiss @yumii', 'kiss'],
    description: 'Faire un bisou à quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const kiss = kissgif[Math.floor(Math.random() * kissgif.length)];

        const embed = {
            description: `😘 **${user.username}**, tu as un bisou de ${message.author.username} *!*`,
            image: {
                url: kiss,
            },
            timestamp: new Date(),
            footer : {
                text: `Kiss`,
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

        const kiss = kissgif[Math.floor(Math.random() * kissgif.length)];

        const embed = {
            description: `😘 **${user.username}**, tu as un bisou de ${interaction.user.username} *!*`,
            image: {
                url: kiss,
            },
            timestamp: new Date(),
            footer : {
                text: `Kiss`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};