const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const sleepygif = require('../../Assets/Gif_.Anime/sleepy.json');

module.exports = {
    name: 'sleepy',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'sleepy <user>',
    examples: ['sleepy @yumii', 'sleepy'],
    description: 'Prendre quelqu\'un dans ses bras',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const sleepy = sleepygif[Math.floor(Math.random() * sleepygif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `😴 **${message.author.username}** a sommeil *!*`,
                image: {
                    url: sleepy,
                },
                timestamp: new Date(),
                footer : {
                    text: `Sleepy`,
                },
            }
    
            if (user) {
                embed.description = `😴 **${message.author.username}** a sommeil devant **${user.username}** *!*`;
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

        const sleepy = sleepygif[Math.floor(Math.random() * sleepygif.length)];

        if (!user || user.id == interaction.user.id) {
            const embed = {
                description: `😴 **${interaction.user.username}** a sommeil *!*`,
                image: {
                    url: sleepy,
                },
                timestamp: new Date(),
                footer : {
                    text: `Sleepy`,
                },
            }
    
            if (user) {
                embed.description = `😴 **${interaction.user.username}** a sommeil devant **${user.username}** *!*`;
            }
    
            interaction.reply({ embeds: [embed] });
        
        }

    },
};