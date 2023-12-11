const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const patgif = require('../../Assets/Gif_.Anime/pat.json');

module.exports = {
    name: 'pat',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'pat <user>',
    examples: ['pat @yumii', 'pat'],
    description: 'Prendre quelqu\'un dans ses bras',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const pat = patgif[Math.floor(Math.random() * patgif.length)];

        const embed = {
            description: `✋ **${message.author.username}** carresse **${user.username}** *!*`,
            image: {
                url: pat,
            },
            timestamp: new Date(),
            footer : {
                text: `Pat`,
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

        const pat = patgif[Math.floor(Math.random() * patgif.length)];

        const embed = {
            description: `✋ **${interaction.user.username}** carresse **${user.username}** *!*`,
            image: {
                url: pat,
            },
            timestamp: new Date(),
            footer : {
                text: `Pat`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};