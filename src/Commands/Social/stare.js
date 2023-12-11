const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const staregif = require('../../Assets/Gif_.Anime/stare.json');

module.exports = {
    name: 'stare',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'stare <user>',
    examples: ['stare @yumii', 'stare'],
    description: 'Prendre quelqu\'un dans ses bras',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const stare = staregif[Math.floor(Math.random() * staregif.length)];

        const embed = {
            description: `👀 **${message.author.username}** regarde **${user.username}** *!*`,
            image: {
                url: stare,
            },
            timestamp: new Date(),
            footer : {
                text: `Stare`,
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

        const stare = staregif[Math.floor(Math.random() * staregif.length)];

        const embed = {
            description: `👀 **${interaction.user.username}** regarde **${user.username}** *!*`,
            image: {
                url: stare,
            },
            timestamp: new Date(),
            footer : {
                text: `Stare`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};