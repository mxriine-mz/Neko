const { PermissionFlagsBits, EmbedBuilder, MessageFlags } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "delete-button",

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const channel = interaction.channel;

        // ——————————————————————————————————————
        // Vérification : est-ce un ticket ?
        // ——————————————————————————————————————
        if (channel.parentId !== process.env.TICKET_CATEGORY_ID) {
            return interaction.reply({
                content: "❌ Ce channel n'est pas un ticket.",
                flags: MessageFlags.Ephemeral
            });
        }

        // ——————————————————————————————————————
        // Désactivation du bouton avant suppression
        // ——————————————————————————————————————
        const row = interaction.message.components[0];
        const deleteBtn = row.components.find(b => b.customId === "delete-button");

        if (deleteBtn) deleteBtn.setDisabled(true);

        await interaction.update({
            components: [row]
        });

        // ——————————————————————————————————————
        // Embed de confirmation
        // ——————————————————————————————————————
        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setDescription(`🗑️ **Le ticket sera supprimé dans 3 secondes...**`)
            .setFooter({ text: "Equipe Tokimeku" });

        await interaction.followUp({ embeds: [embed] });

        // ——————————————————————————————————————
        // DB : marquer le ticket comme fermé
        // ——————————————————————————————————————
        userSettings.ticket = false;
        await userSettings.save();

        // ——————————————————————————————————————
        // Suppression du channel après délai
        // ——————————————————————————————————————
        setTimeout(async () => {
            try {
                await channel.delete("Ticket supprimé par l’utilisateur");
            } catch (err) {
                console.log("Erreur suppression :", err);
            }
        }, 3000);
    }
};
