const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function createTicketButton({ ownerId, isClosed = false }) {
    return new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId(`close-button:${ownerId}`)
            .setLabel("🔒 Close")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(isClosed),

        new ButtonBuilder()
            .setCustomId(`reopen-button:${ownerId}`)
            .setLabel("🔓 Reopen")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(!isClosed),

        new ButtonBuilder()
            .setCustomId(`delete-button:${ownerId}`)
            .setLabel("🗑️ Delete")
            .setStyle(ButtonStyle.Danger)
    );
}

module.exports = { createTicketButton };
