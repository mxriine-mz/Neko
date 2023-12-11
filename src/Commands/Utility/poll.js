const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'poll',
    category: 'utility',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: false,
    usage: 'poll <question> <réponse 1> <réponse 2> ... <réponse n>',
    examples: ['poll Est-ce que ce bot est cool ? Oui Non'],
    description: 'Poster votre propre sondage',

    run: async (client, message, args, guildSettings, userSettings) => {
        
        if (!args[0]) return message.reply('Merci d\'entrer une question pour votre sondage !');
        
        const embed = {
            color: 0x202225,
            title: ('Sondage'),
            description: args.slice(0).join(''),
            timestamp: new Date(),
            footer: {
                text: 'Par ' + message.author.tag + '!',
                icon_url: message.author.displayAvatarURL(),
            },
        }

        const poll = await interaction.reply({ embeds: [embed], fetchReply: true });
        poll.react('✅');
        poll.react('❌');
       
    },
    options: [
        {
            name: 'title',
            description: 'Taper le titre de votre sondage',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'content',
            description: 'Taper la question de votre sondage',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const pollTitle = interaction.options.getString('title');
        const pollContent = interaction.options.getString('content');

        const embed = {
            color: 0x202225,
            title: pollTitle,
            description: pollContent,
            timestamp: new Date(),
            footer: {
                text: 'Par ' + interaction.user.tag + '!',
                icon_url: interaction.user.displayAvatarURL(),
            },
        }

        const poll = await interaction.reply({ embeds: [embed], fetchReply: true });
        poll.react('✅');
        poll.react('❌');
        
    },

};