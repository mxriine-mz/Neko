module.exports = {
    name: "close-cancel-button",

    runInteraction: async (client, interaction) => {
        return interaction.update({
            content: "❌ Fermeture annulée.",
            components: []
        });
    }
};
