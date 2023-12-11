const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const lewdgif = require('../../Assets/Gif_.Anime/lewd.json');

module.exports = {
    name: 'lewd',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'lewd <user>',
    examples: ['lewd @yumii', 'lewd'],
    description: 'Penser que quelqu\'un est obscène',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const lewd = lewdgif[Math.floor(Math.random() * lewdgif.length)];

        if (!user || user.id == message.author.id) {
        const embed = {
            description: `😳 **${message.author.username}** est obscène *!*`,
            image: {
                url: lewd,
            },
            timestamp: new Date(),
            footer : {
                text: `Lewd`,
            },
        }

        if (user) {
            embed.description = `😳 **${message.author.username}** pense que **${user.username}** est obscène *!*`;
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

        const user = interaction.options.getUser('user') || client.user;

        if (!user || user.id == interaction.user.id) {
            const embed = {
                description: `😳 **${interaction.user.username}** est obscène *!*`,
                image: {
                    url: lewd,
                },
                timestamp: new Date(),
                footer : {
                    text: `Lewd`,
                },
            }
    
            if (user) {
                embed.description = `😳 **${interaction.user.username}** pense que **${user.username}** est obscène *!*`;
            }
    
            interaction.reply({ embeds: [embed] });
        
            }

    },
};