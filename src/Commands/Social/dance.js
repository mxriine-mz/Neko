const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const dancegif = require('../../Assets/Gif_.Anime/dance.json');

module.exports = {
    name: 'dance',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'dance <user>',
    examples: ['dance @yumii', 'dance'],
    description: 'Danser avec quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const dance = dancegif[Math.floor(Math.random() * dancegif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `**${message.author.username}** danse *!*`,
                image: {
                    url: dance,
                },
                timestamp: new Date(),
                footer : {
                    text: `Dance`,
                },
            }
    
            if (user) {
                embed.description = `**${message.author.username}** danse avec **${user.username}** *!*`;
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

        const dance = dancegif[Math.floor(Math.random() * dancegif.length)];

        if (!user || user.id == interaction.user.id) {
            const embed = {
                description: `**${interaction.user.username}** danse *!*`,
                image: {
                    url: dance,
                },
                timestamp: new Date(),
                footer : {
                    text: `Dance`,
                },
            }
    
            if (user) {
                embed.description = `**${interaction.user.username}** danse avec **${user.username}** *!*`;
            }

            interaction.reply({ embeds: [embed] });
        
        }

    },
};