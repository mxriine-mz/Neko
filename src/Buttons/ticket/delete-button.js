const { ActionRowBuilder, MessageFlags, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "delete-button",

    runInteraction: async (client, interaction) => {

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`delete-confirm-button:${interaction.user.id}`)
                .setLabel("🗑️ Confirmer")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("delete-cancel-button")
                .setLabel("Annuler")
                .setStyle(ButtonStyle.Secondary)
        );

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Suppression du ticket")
            .setDescription("Veux-tu vraiment supprimer ce ticket ?");

        return interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
};
