const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const smilegif = require('../../Assets/Gif_.Anime/smile.json');

module.exports = {
    name: 'smile',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'smile <user>',
    examples: ['smile @yumii', 'smile'],
    description: 'Prendre quelqu\'un dans ses bras',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const smile = smilegif[Math.floor(Math.random() * smilegif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `😄 **${message.author.username}** sourit *!*`,
                image: {
                    url: smile,
                },
                timestamp: new Date(),
                footer : {
                    text: `Smile`,
                },
            }
    
            if (user) {
                embed.description = `😄 **${message.author.username}** sourit devant **${user.username}** *!*`;
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

        const smile = smilegif[Math.floor(Math.random() * smilegif.length)];

        if (!user || user.id == interaction.user.id) {
            const embed = {
                description: `😄 **${interaction.user.username}** sourit *!*`,
                image: {
                    url: smile,
                },
                timestamp: new Date(),
                footer : {
                    text: `Smile`,
                },
            }
    
            if (user) {
                embed.description = `😄 **${interaction.user.username}** sourit devant **${user.username}** *!*`;
            }
    
            interaction.reply({ embeds: [embed] });
        
        }

    },
};