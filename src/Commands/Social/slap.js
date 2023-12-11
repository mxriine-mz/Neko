const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const slapgif = require('../../Assets/Gif_.Anime/slap.json');

module.exports = {
    name: 'slap',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'slap <user>',
    examples: ['slap @yumii', 'slap'],
    description: 'Prendre quelqu\'un dans ses bras',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const slap = slapgif[Math.floor(Math.random() * slapgif.length)];

        const embed = {
            description: `✋ **${message.author.username}** gifle **${user.username}** *!*`,
            image: {
                url: slap,
            },
            timestamp: new Date(),
            footer : {
                text: `Slap`,
            },
        }

        if (user.id === message.author.id) {
            embed.description = `✋ **${message.author.username}** se gifle *!*`;
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

        const slap = slapgif[Math.floor(Math.random() * slapgif.length)];

        const embed = {
            description: `✋ **${interaction.user.username}** gifle **${user.username}** *!*`,
            image: {
                url: slap,
            },
            timestamp: new Date(),
            footer : {
                text: `Slap`,
            },
        }

        if (user.id === interaction.user.id) {
            embed.description = `✋ **${interaction.user.username}** se gifle *!*`;
        }

        interaction.reply({ embeds: [embed] });

    },
};