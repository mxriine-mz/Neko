const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const blushgif = require('../../Assets/Gif_.Anime/blush.json');

module.exports = {
    name: 'blush',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'blush <user>',
    examples: ['blush @yumii', 'blush'],
    description: 'Rougir devant quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const blush = blushgif[Math.floor(Math.random() * blushgif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `😳 **${message.author.username}** rougi *!*`,
                image: {
                    url: blush,
                },
                timestamp: new Date(),
                footer : {
                    text: `Blush`,
                },
            }
    
            if (user) {
                embed.description = `😳 **${message.author.username}** rougi devant **${user.username}** *!*`;
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

        const blush = blushgif[Math.floor(Math.random() * blushgif.length)];

        if (!user || user.id == interaction.user.id) {
            const embed = {
                description: `😳 **${interaction.user.username}** rougi *!*`,
                image: {
                    url: blush,
                },
                timestamp: new Date(),
                footer : {
                    text: `Blush`,
                },
            }
    
            if (user) {
                embed.description = `😳 **${interaction.user.username}** rougi devant **${user.username}** *!*`;
            }
    
            interaction.reply({ embeds: [embed] });
        
        }
    },
};