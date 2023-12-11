const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const greetgif = require('../../Assets/Gif_.Anime/greet.json');

module.exports = {
    name: 'greet',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'greet <user>',
    examples: ['greet @yumii', 'greet'],
    description: 'Saluer quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const greet = greetgif[Math.floor(Math.random() * greetgif.length)];

        const embed = {
            description: `👋 **${message.author.username}** salue **${user.username}** *!*`,
            image: {
                url: greet,
            },
            timestamp: new Date(),
            footer : {
                text: `Greet`,
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

        const greet = greetgif[Math.floor(Math.random() * greetgif.length)];

        const embed = {
            description: `👋 **${interaction.user.username}** salue **${user.username}** *!*`,
            image: {
                url: greet,
            },
            timestamp: new Date(),
            footer : {
                text: `Greet`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};