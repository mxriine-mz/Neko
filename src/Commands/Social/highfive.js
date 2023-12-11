const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const highfivegif = require('../../Assets/Gif_.Anime/highfive.json');

module.exports = {
    name: 'highfive',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'highfive <user>',
    examples: ['highfive @yumii', 'highfive'],
    description: 'Tope avec quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const highfive = highfivegif[Math.floor(Math.random() * highfivegif.length)];

        const embed = {
            description: `✋ **${message.author.username}** tope là **${user.username}** ✋ *!*`,
            image: {
                url: highfive,
            },
            timestamp: new Date(),
            footer : {
                text: `Highfive`,
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

        const highfive = highfivegif[Math.floor(Math.random() * highfivegif.length)];

        const embed = {
            description: `✋ **${interaction.user.username}** tope là **${user.username}** ✋ *!*`,
            image: {
                url: highfive,
            },
            timestamp: new Date(),
            footer : {
                text: `Highfive`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};