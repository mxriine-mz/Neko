const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const dabgif = require('../../Assets/Gif_.Anime/dab.json');

module.exports = {
    name: 'dab',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'dab <user>',
    examples: ['dab @yumii', 'dab'],
    description: 'Faire un dab',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const dab = dabgif[Math.floor(Math.random() * dabgif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `**${message.author.username}** dab *!*`,
                image: {
                    url: dab,
                },
                timestamp: new Date(),
                footer : {
                    text: `Dab`,
                },
            }
    
            if (user) {
                embed.description = `**${message.author.username}** dab à **${user.username}** *!*`;
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

        const dab = dabgif[Math.floor(Math.random() * dabgif.length)];

        if (!user || user.id == interaction.user.id) {
            const embed = {
                description: `**${interaction.user.username}** dab *!*`,
                image: {
                    url: dab,
                },
                timestamp: new Date(),
                footer : {
                    text: `Dab`,
                },
            }
    
            if (user) {
                embed.description = `**${interaction.user.username}** dab à **${user.username}** *!*`;
            }
    
            interaction.reply({ embeds: [embed] });
        
        }

    },
};