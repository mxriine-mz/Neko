const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

/**
 * Génère les boutons d’un ticket selon son état.
 * @param {Object} options 
 * @param {boolean} options.isClosed - Si le ticket est fermé.
 * @returns {ActionRowBuilder}
 */
function createTicketButton({ isClosed = false } = {}) {
    
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("close-button")
            .setLabel("🔒 Close")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(isClosed),                   // Désactivé si fermé

        new ButtonBuilder()
            .setCustomId("reopen-button")
            .setLabel("🔓 Reopen")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(!isClosed),                 // Activé uniquement si fermé

        new ButtonBuilder()
            .setCustomId("delete-button")
            .setLabel("🗑️ Delete")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false)                      // Toujours dispo
    );

    return row;
}

module.exports = { createTicketButton };
