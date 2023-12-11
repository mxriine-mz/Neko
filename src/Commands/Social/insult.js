const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const insultgif = require('../../Assets/Gif_.Anime/insult.json');

module.exports = {
    name: 'insult',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'insult <user>',
    examples: ['insult @yumii', 'insult'],
    description: 'Insulter quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const insult = insultgif[Math.floor(Math.random() * insultgif.length)];

        const embed = {
            description: `🤬 **${user.username}**, vous vous faites insulter par **${message.author.username}** *!*`,
            image: {
                url: insult,
            },
            timestamp: new Date(),
            footer : {
                text: `Insult`,
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

        const insult = insultgif[Math.floor(Math.random() * insultgif.length)];

        const embed = {
            description: `🤬 **${user.username}**, vous vous faites insulter par **${interaction.user.username}** *!*`,
            image: {
                url: insult,
            },
            timestamp: new Date(),
            footer : {
                text: `Insult`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};