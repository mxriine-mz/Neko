const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

function createCmdMenu(client, interaction) {
    const HelpCmdMenu = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('helpcmd-menu')
            .setPlaceholder('Fais un choix')
        );

      const HelpCmdMenu2 = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('helpcmd2-menu')
              .setPlaceholder('Fais un choix')
          );

    const selectedOption = interaction.values[0];

    const array = client.commands.filter(cmd => cmd.category == selectedOption.toLowerCase()).map(cmd => cmd.name);

    if (array.length > 20) {
            
        const firstPart = array.slice(0, 20);
        const secondPart = array.slice(20, array.length);
    
        for (const command of firstPart) {
          HelpCmdMenu.components[0].addOptions({
             label: command,
             value: command,
          });
        }
    
        for (const command of secondPart) {
                 HelpCmdMenu2.components[0].addOptions({
                    label: command,
                    value: command,
                 });
                  }
    
        return [HelpCmdMenu, HelpCmdMenu2];

     } else {    
        const firstPart = array;
    
        for (const command of firstPart) {
          HelpCmdMenu.components[0].addOptions({
            label: command,
            value: command,
          });
        }
    
        return [HelpCmdMenu];
    }

}
  
module.exports = { createCmdMenu };