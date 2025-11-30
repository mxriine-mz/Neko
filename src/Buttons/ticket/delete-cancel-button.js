module.exports = {
    name: "delete-cancel-button",

    runInteraction: async (client, interaction) => {
        return interaction.update({
            content: "❌ Suppression annulée.",
            components: []
        });
    }
};
