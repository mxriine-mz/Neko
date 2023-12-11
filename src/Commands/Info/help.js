const { PermissionFlagsBits } = require('discord.js');
const { createMainMenu } = require('../../Assets/SelectMenu/HelpMainMenu.js');

module.exports = {
    name: 'help',
    category: 'info',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: false,
    usage: 'help <command>',
    examples: ['help', 'help say', 'help emit'],
    description: 'Commande d\'aide',

    run: async (client, message, args, guildSettings, userSettings) => {

        const HelpMainMenu = createMainMenu(client);

        const embed = {
            author : {
                name: `Neko`,
                icon_url: client.user.displayAvatarURL({ dynamic: true }),
            },
            description : `Bienvenue dans l'aide de ${client.user}, vous trouverez ici toutes les commandes disponibles !`,
            fields: [ 
                {
                    name: 'Commandes',
                    value: `>>> Vous pouvez retrouver toutes les commandes de base en utilisant le menu de sélection ci-dessous.`,
                }
            ],
            image: {
                url: 'https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png',
            },
        }

        message.channel.send({ embeds: [embed], components: [HelpMainMenu] })
        

    },

};