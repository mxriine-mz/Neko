const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const confugif = require('../../Assets/Gif_.Anime/confused.json');

module.exports = {
    name: 'confused',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'confu <user>',
    examples: ['confu @yumii', 'confu'],
    description: 'Quelqu\'un vous a rendu confus',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const confu = confugif[Math.floor(Math.random() * confugif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `**${message.author.username}** est confu *!*`,
                image: {
                    url: confu,
                },
                timestamp: new Date(),
                footer : {
                    text: `Confused`,
                },
            }
    
            if (user) {
                embed.description = `**${user.username}** met **${message.author.username}** confu *!*`;
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

        const confu = confugif[Math.floor(Math.random() * confugif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `**${message.author.username}** est confu *!*`,
                image: {
                    url: confu,
                },
                timestamp: new Date(),
                footer : {
                    text: `Confused`,
                },
            }
    
            if (user) {
                embed.description = `**${user.username}** met **${interaction.user.username}** confu *!*`;
            }
    
            message.channel.send({ embeds: [embed] });
        
        }
    },
};