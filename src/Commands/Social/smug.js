const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const smuggif = require('../../Assets/Gif_.Anime/smug.json');

module.exports = {
    name: 'smug',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'smug <user>',
    examples: ['smug @yumii', 'smug'],
    description: 'Prendre quelqu\'un dans ses bras',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const smug = smuggif[Math.floor(Math.random() * smuggif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `**${message.author.username}** a l'air satisfait *!*`,
                image: {
                    url: smug,
                },
                timestamp: new Date(),
                footer : {
                    text: `Smug`,
                },
            }
    
            if (user) {
                embed.description = `**${message.author.username}** prend l'air satisfait devant **${user.username}** *!*`;
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

        const smug = smuggif[Math.floor(Math.random() * smuggif.length)];

        if (!user || user.id == interaction.user.id) {
            const embed = {
                description: `**${interaction.user.username}** a l'air satisfait *!*`,
                image: {
                    url: smug,
                },
                timestamp: new Date(),
                footer : {
                    text: `Smug`,
                },
            }
    
            if (user) {
                embed.description = `**${interaction.user.username}** prend l'air satisfait devant **${user.username}** *!*`;
            }
    
            interaction.reply({ embeds: [embed] });
        
        }
    },
};