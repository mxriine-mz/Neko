const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const bitegif = require('../../Assets/Gif_.Anime/bite.json');

module.exports = {
    name: 'bite',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'bite <user>',
    examples: ['bite @yumii', 'bite'],
    description: 'Mordre quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const bite = bitegif[Math.floor(Math.random() * bitegif.length)];

        const embed = {
            description: `😬 **${message.author.username}** mord **${user.username}** *!*`,
            image: {
                url: bite,
            },
            timestamp: new Date(),
            footer : {
                text: `Bite`,
            },
        }

        if (user == message.author) {
            embed.description = `😬 **${message.author.username}** se mord *!*` }


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

        const user = interaction.options.getUser('user') || client.user.username;

        const bite = bitegif[Math.floor(Math.random() * bitegif.length)];

        const embed = {
            description: `😬 ${interaction.user.username} mord ${user.username} *!*`,
            image: {
                url: bite,
            },
            timestamp: new Date(),
            footer : {
                text: `Bite`,
            },
        }

        if (user == message.author) {
            embed.description = `😬 **${message.author.username}** se mord *!*` }


        message.channel.send({ embeds: [embed] });

    },
};