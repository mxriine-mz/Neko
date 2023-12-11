const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { readdirSync } = require('fs');

function createMainMenu(client) {
    const HelpMainMenu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('helpmain-menu')
                .setPlaceholder('Main Menu')
                .addOptions({
                    label: 'Main Menu',
                    value: 'Main Menu',
                })
            );

    const maxCommands = 10;
    const commandsFolder = readdirSync('./src/Commands').filter(folder => folder !== 'Embed');

    for (const category of commandsFolder) {
        
        HelpMainMenu.components[0].addOptions({
            label: category,
            description: `${client.commands.filter(cmd => cmd.category == category.toLowerCase()).map(cmd => cmd.name).slice(0, maxCommands).join(', ')}`,
            value: category,

        })
    }

    return HelpMainMenu;
}
  
  module.exports = { createMainMenu };