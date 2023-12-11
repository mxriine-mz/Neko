const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const thinkinggif = require('../../Assets/Gif_.Anime/thinking.json');

module.exports = {
    name: 'thinking',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'thinking <user>',
    examples: ['thinking @yumii', 'thinking'],
    description: 'Prendre quelqu\'un dans ses bras',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const thinking = thinkinggif[Math.floor(Math.random() * thinkinggif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `**${message.author.username}** réfléchit *!*`,
                image: {
                    url: thinking,
                },
                timestamp: new Date(),
                footer : {
                    text: `Thinking`,
                },
            }
    
            if (user) {
                embed.description = `**${message.author.username}** réfléchit devant **${user.username}** *!*`;
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

        const thinking = thinkinggif[Math.floor(Math.random() * thinkinggif.length)];

        if (!user || user.id == interaction.user.id) {
            const embed = {
                description: `**${interaction.user.username}** réfléchit *!*`,
                image: {
                    url: thinking,
                },
                timestamp: new Date(),
                footer : {
                    text: `Thinking`,
                },
            }
    
            if (user) {
                embed.description = `**${interaction.user.username}** réfléchit devant **${user.username}** *!*`;
            }
    
            interaction.reply({ embeds: [embed] });
        
        }

    },
};