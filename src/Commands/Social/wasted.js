const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const wastedgif = require('../../Assets/Gif_.Anime/wasted.json');

module.exports = {
    name: 'wasted',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'wasted <user>',
    examples: ['wasted @yumii', 'wasted'],
    description: 'Prendre quelqu\'un dans ses bras',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const wasted = wastedgif[Math.floor(Math.random() * wastedgif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `😵 **${message.author.username}** is wasted *!*`,
                image: {
                    url: wasted,
                },
                timestamp: new Date(),
                footer : {
                    text: `Wasted`,
                },
            }
    
            if (user) {
                embed.description = `😵 **${user.username}** is wasted *!*`;
            }
    
            message.channel.send({ embeds: [embed] });
        }
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

        const user = interaction.options.getUser('user');

        const wasted = wastedgif[Math.floor(Math.random() * wastedgif.length)];

        if (!user || user.id == interaction.user.id) {
            const embed = {
                description: `😵 **${interaction.user.username}** is wasted *!*`,
                image: {
                    url: wasted,
                },
                timestamp: new Date(),
                footer : {
                    text: `Wasted`,
                },
            }
    
            if (user) {
                embed.description = `😵 **${user.username}** is wasted *!*`;
            }
    
            interaction.reply({ embeds: [embed] });
        }

    },
};