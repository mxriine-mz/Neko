const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

module.exports = {
    name: "close-button",

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const channel = interaction.channel;

        // Sécurité : vérifier que c’est un ticket
        if (channel.parentId !== process.env.TICKET_CATEGORY_ID) {
            return interaction.reply({
                content: "❌ Ce channel n'est pas un ticket.",
                flags: MessageFlags.Ephemeral
            });
        }

        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription(`**${interaction.user.username}**, veux-tu vraiment fermer ce ticket ?`)
            .setFooter({ text: "Equipe Tokimeku" });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`ticket-close-confirm:${interaction.user.id}`)
                .setLabel("🔒 Confirmer")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("ticket-close-cancel")
                .setLabel("Annuler")
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
};
