const { MessageFlags } = require("discord.js");

module.exports = {
    name: "delete-confirm-button",

    runInteraction: async (client, interaction) => {

        const [prefix, ownerId] = interaction.customId.split(":");

        // Vérifier si le user est owner OU modérateur
        if (
            interaction.user.id !== ownerId &&
            !interaction.member.permissions.has("ManageMessages")
        ) {
            return interaction.reply({
                content: "Ce bouton n'est pas pour toi oh.",
                flags: MessageFlags.Ephemeral
            });
        }

        await interaction.update({
            content: "🗑️ Suppression du ticket...",
            components: []
        });

        // 🔥🔥🔥 UPDATE DATABASE AVANT DELETE 🔥🔥🔥
        try {
            console.log("[Ticket] DB Reset pour :", ownerId);

            await client.updateUser(ownerId, {
                ticket: false,
                ticketMessageId: null
            });

        } catch (err) {
            console.log("❌ Erreur reset DB :", err);
        }

        // 🔥 Petit délai pour laisser le message passer
        setTimeout(() => {
            interaction.channel.delete().catch(() => {});
        }, 1500);
    }
};
