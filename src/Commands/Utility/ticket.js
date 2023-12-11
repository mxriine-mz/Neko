const { PermissionFlagsBits } = require('discord.js');
const { createTicketMenu } = require('../../Assets/SelectMenu/TicketMenu');

module.exports = {
    name: 'ticket',
    category: 'embed',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: true,
    usage: 'ticket',
    examples: ['ticket'],
    description: 'Envoie un embed avec des informations',

    run: async (client, message, args, guildSettings, userSettings) => {

        const TicketMenu = createTicketMenu(client);

        const embed = {
            title: `・HELP SUPPORT`,
            description:`**Comment pouvons-nous vous aider ?\n**` +
            `Si vous avez besoin d'aide concernant le serveur, n'hésitez pas à cliquer sur le bouton **"Ouvrir un ticket"** ci-dessous !\n`,
            image: {
                url: 'https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png',
            },
            footer: {
                text: '・Equipe Tokimeku',
            },
        }
        
        message.channel.send({ embeds: [embed], components: [TicketMenu] });

        message.delete();
    },
};