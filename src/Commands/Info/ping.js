const { PermissionFlagsBits } = require('discord.js');
require('dotenv').config()

module.exports = {
    name: 'ping',
    category: 'info',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: false,
    usage: 'ping',
    examples: 'ping',
    description: 'Affiche le ping du bot',

    run: async (client, message, args, guildSettings, userSettings) => {
        
        const tryPong = await message.channel.send('On essaie de pong. . . un instant *!*');

        const embed = {
            color: 0x202225,
            title: '🏓Pong !',
            description: 'Affiche le ping du bot',
            thumbnail: {
                url: client.user.displayAvatarURL({ dynamic: true, size: 512 }),
            },
            fields: [
                {
                    name: 'Latence API',
                    value: `\`\`\`${client.ws.ping}ms\`\`\``,
                    inline: true,
                },
                {
                    name: 'Latence BOT',
                    value: `\`\`\`${parseInt(tryPong.createdTimestamp - message.createdTimestamp)}ms\`\`\``,
                    inline: true,
                },
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: client.user.username,
                icon_url: client.user.displayAvatarURL({ dynamic: true }),
            },
        };

        tryPong.edit({ content: ' ', embeds: [embed] });
    },

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const tryPong = await interaction.reply({content : 'On essaie de pong. . . un instant *!*', fetchReply: true});

        const embed = {
            color: 0x202225,
            title: '🏓Pong !',
            permissions: ['BAN_MEMBERS', 'KICK_MEMBERS'],
            description: 'Affiche le ping du bot',
            thumbnail: {
                url: client.user.displayAvatarURL({ dynamic: true, size: 512 }),
            },
            fields: [
                {
                    name: 'Latence API',
                    value: `\`\`\`${client.ws.ping}ms\`\`\``,
                    inline: true,
                },
                {
                    name: 'Latence BOT',
                    value: `\`\`\`${parseInt(tryPong.createdTimestamp - interaction.createdTimestamp)}ms\`\`\``,
                    inline: true,
                },
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: client.user.username,
                icon_url: client.user.displayAvatarURL({ dynamic: true }),
            },
        };

        interaction.editReply({ content: ' ', embeds: [embed] });

},

};