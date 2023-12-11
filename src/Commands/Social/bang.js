const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const banggif = require('../../Assets/Gif_.Anime/bang.json');

module.exports = {
    name: 'bang',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'bang <user>',
    examples: ['bang @yumii', 'bang'],
    description: 'Faire sauter quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first() || client.user.username;

        const bang = banggif[Math.floor(Math.random() * banggif.length)];

        const embed = {
            description: `☠ **${message.author.username}** fait sauter **${user.username}** 🔫 *!*`,
            image: {
                url: bang,
            },
            timestamp: new Date(),
            footer : {
                text: `Bang`,
            },
        }

        if (user == message.author) {
            embed.description = `☠ **${message.author.username}** se fait sauter 🔫 *!*` }


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

        const bang = banggif[Math.floor(Math.random() * banggif.length)];

        const embed = {
            description: `☠ **${interaction.user.username}** fait sauter **${user.username}** 🔫 *!*`,
            image: {
                url: bang,
            },
            timestamp: new Date(),
            footer : {
                text: `Bang`,
            },
        }

        if (user == interaction.user) {
            embed.description = `☠ **${interaction.user.username}** se fait sauter 🔫 *!*` }


        interaction.reply({ embeds: [embed] });

    },
};