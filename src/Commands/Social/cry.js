const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const crygif = require('../../Assets/Gif_.Anime/cry.json');

module.exports = {
    name: 'cry',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'cry <user>',
    examples: ['cry @yumii', 'cry'],
    description: 'Quelqu\'un vous a fait pleurer',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const cry = crygif[Math.floor(Math.random() * crygif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `😢 **${message.author.username}** pleure *!*`,
                image: {
                    url: cry,
                },
                timestamp: new Date(),
                footer : {
                    text: `Cry`,
                },
            }
    
            if (user) {
                embed.description = `😢 **${user.username}** a fait pleurer **${message.author.username}** *!*`;
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

        const cry = crygif[Math.floor(Math.random() * crygif.length)];

        if (!user || user.id == interaction.user.id) {
            const embed = {
                description: `😢 **${interaction.user.username}** pleure *!*`,
                image: {
                    url: cry,
                },
                timestamp: new Date(),
                footer : {
                    text: `Cry`,
                },
            }
    
            if (user) {
                embed.description = `😢 **${user.username}** a fait pleurer **${interaction.user.username}** *!*`;
            }
    
            interaction.reply({ embeds: [embed] });
        
        }

    },
};