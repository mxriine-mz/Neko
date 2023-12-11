const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const shruggif = require('../../Assets/Gif_.Anime/shrug.json');

module.exports = {
    name: 'shrug',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'shrug <user>',
    examples: ['shrug @yumii', 'shrug'],
    description: 'Prendre quelqu\'un dans ses bras',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const shrug = shruggif[Math.floor(Math.random() * shruggif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `🧐 **${message.author.username}** hausse les épaules *!*`,
                image: {
                    url: shrug,
                },
                timestamp: new Date(),
                footer : {
                    text: `Shrug`,
                },
            }
    
            if (user) {
                embed.description = `🧐 **${message.author.username}** hausse les épaules à **${user.username}** *!*`;
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

        const shrug = shruggif[Math.floor(Math.random() * shruggif.length)];

        if (!user || user.id == interaction.user.id) {
            const embed = {
                description: `🧐 **${interaction.user.username}** hausse les épaules *!*`,
                image: {
                    url: shrug,
                },
                timestamp: new Date(),
                footer : {
                    text: `Shrug`,
                },
            }
    
            if (user) {
                embed.description = `🧐 **${interaction.user.username}** hausse les épaules à **${user.username}** *!*`;
            }
    
            interaction.reply({ embeds: [embed] });
        
        }

    },
};