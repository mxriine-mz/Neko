const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const poutgif = require('../../Assets/Gif_.Anime/pout.json');

module.exports = {
    name: 'pout',
    category: 'social',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'pout <user>',
    examples: ['pout @yumii', 'pout'],
    description: 'Faire la tête à quelqu\'un',

    run: async (client, message, args, guildSettings, userSettings) => {

        const user = message.mentions.users.first();

        const pout = poutgif[Math.floor(Math.random() * poutgif.length)];

        if (!user || user.id == message.author.id) {
            const embed = {
                description: `😶 **${message.author.username}** fait la tête *!*`,
                image: {
                    url: pout,
                },
                timestamp: new Date(),
                footer : {
                    text: `Pout`,
                },
            }
    
            if (user) {
                embed.description = `😶 **${message.author.username}** fait la tête à **${user.username}** *!*`;
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

        const pout = poutgif[Math.floor(Math.random() * poutgif.length)];

        if (!user || user.id == interaction.user.id) {
            const embed = {
                description: `😶 **${interaction.user.username}** fait la tête *!*`,
                image: {
                    url: pout,
                },
                timestamp: new Date(),
                footer : {
                    text: `Pout`,
                },
            }
    
            if (user) {
                embed.description = `😶 **${interaction.user.username}** fait la tête à **${user.username}** *!*`;
            }
    
            interaction.reply({ embeds: [embed] });
        
            }

    },
};