const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const punchgif = require('../../Assets/Gif_.Anime/punch.json');

module.exports = {
    name: 'punch',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'punch <user>',
    examples: ['punch @yumii', 'punch'],
    description: 'Prendre quelqu\'un dans ses bras',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const punch = punchgif[Math.floor(Math.random() * punchgif.length)];

        const embed = {
            description: `👊 **${message.author.username}** donne un coup de poing à **${user.username}** *!*`,
            image: {
                url: punch,
            },
            timestamp: new Date(),
            footer : {
                text: `Punch`,
            },
        }

        if (user.id === message.author.id) {
            embed.description = `👊 **${message.author.username}** se prend un coup de poing *!*`;
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

        const punch = punchgif[Math.floor(Math.random() * punchgif.length)];

        const embed = {
            description: `👊 **${interaction.user.username}** donne un coup de poing à **${user.username}** *!*`,
            image: {
                url: punch,
            },
            timestamp: new Date(),
            footer : {
                text: `Punch`,
            },
        }

        if (user.id === interaction.user.id) {
            embed.description = `👊 **${interaction.user.username}** se prend un coup de poing *!*`;
        }

        interaction.reply({ embeds: [embed] });

    },
};