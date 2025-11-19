const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

/**
 * Création du menu principal d’aide.
 * Liste toutes les catégories de commandes basées sur client.commands
 * @param {Client} client
 * @returns {ActionRowBuilder}
 */
function createMainMenu(client) {

    // ——————————————————————————————————
    // Extraire les catégories existantes
    // ——————————————————————————————————
    const categories = [...new Set(
        client.commands
            .filter(cmd => !!cmd.category)
            .map(cmd => cmd.category.toLowerCase())
    )];

    // Trier alphabétiquement (UX ++)
    categories.sort((a, b) => a.localeCompare(b));

    // ——————————————————————————————————
    // Construire le select menu
    // ——————————————————————————————————
    const select = new StringSelectMenuBuilder()
        .setCustomId("helpmain-menu")
        .setPlaceholder("📚 Choisissez une catégorie")
        .addOptions([
            {
                label: "🏠 Main Menu",
                description: "Retour au menu principal",
                value: "Main Menu",
            }
        ]);

    // ——————————————————————————————————
    // Ajouter toutes les catégories
    // ——————————————————————————————————
    for (const category of categories) {

        const commands = client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => cmd.name)
            .slice(0, 10); // aperçu

        const label = category.charAt(0).toUpperCase() + category.slice(1);

        select.addOptions({
            label,
            description: commands.length
                ? commands.join(", ")
                : "Aucune commande dans cette catégorie",
            value: label, // valeur = nom propre capitalisé
        });
    }

    // ——————————————————————————————————
    // Final ActionRow
    // ——————————————————————————————————
    return new ActionRowBuilder().addComponents(select);
}

module.exports = { createMainMenu };
