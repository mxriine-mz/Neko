require('dotenv').config();
const { createMainMenu } = require('../../Assets/SelectMenu/HelpMainMenu.js');
const { createCmdMenu } = require('../../Assets/SelectMenu/HelpCmdMenu.js');

module.exports = {
    name: 'helpmain-menu',

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const selectedOption = interaction.values[0];

        const mainMenu = createMainMenu(client);

        mainMenu.components[0].setPlaceholder(selectedOption);
        
        const cmd1 = createCmdMenu(client, interaction)[0];
        const cmd2 = createCmdMenu(client, interaction)[1];


        if (selectedOption == 'Main Menu') {
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

            interaction.update({embeds: [embed], components: [mainMenu]});
            return;
        }

  
        const newEmbed = {
            author: {
                name: `Neko`,
                icon_url: client.user.displayAvatarURL({ dynamic: true }),
            },
            title: `Visualisation de la catégorie ${selectedOption}`,
            description: `${client.commands.filter(cmd => cmd.category == selectedOption.toLowerCase()).map(cmd => `\`${guildSettings.prefix}${cmd.name}\` - ${cmd.description}`).slice(0, 10).join('\n')}`,

        };


        if (cmd2 == undefined) {
            interaction.update({embeds: [newEmbed], components: [mainMenu, cmd1]});
        } else {
            interaction.update({embeds: [newEmbed], components: [mainMenu, cmd1, cmd2]});
        }
        
    }
};