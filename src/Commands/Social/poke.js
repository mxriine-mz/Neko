const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const pokegif = require('../../Assets/Gif_.Anime/poke.json');

module.exports = {
    name: 'poke',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'poke <user>',
    examples: ['poke @yumii', 'poke'],
    description: 'Donne un petit coup de poing à quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user;

        const poke = pokegif[Math.floor(Math.random() * pokegif.length)];

        const embed = {
            description: `**${message.author.username}** donne un petit coup à **${user.username}** *!*`,
            image: {
                url: poke,
            },
            timestamp: new Date(),
            footer : {
                text: `Poke`,
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

        const poke = pokegif[Math.floor(Math.random() * pokegif.length)];

        const embed = {
            description: `**${interaction.user.username}** donne un petit coup à **${user.username}** *!*`,
            image: {
                url: poke,
            },
            timestamp: new Date(),
            footer : {
                text: `Poke`,
            },
        }

        interaction.reply({ embeds: [embed] });

    },
};