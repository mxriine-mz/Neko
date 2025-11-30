const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
    name: "close-button",

    runInteraction: async (client, interaction) => {

        const [prefix, ownerId] = interaction.customId.split(":");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`close-confirm-button:${ownerId}`)
                .setLabel("🔒 Confirmer")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("close-cancel-button")
                .setLabel("Annuler")
                .setStyle(ButtonStyle.Secondary)
        );

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Fermeture du ticket")
            .setDescription("Veux-tu vraiment fermer ce ticket ?");

        return interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
};
