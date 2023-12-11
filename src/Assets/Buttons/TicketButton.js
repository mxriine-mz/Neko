const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function createTicketButton() {
    const TicketButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('close-button')
                .setLabel('🔒 Close')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId('reopen-button')
                .setLabel('🔓 Reopen')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId('delete-button')
                .setLabel('🗑️ Delete')
                .setStyle(ButtonStyle.Danger),

        );

    return TicketButton;

}

module.exports = { createTicketButton };