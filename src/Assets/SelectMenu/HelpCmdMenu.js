const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

/**
 * Crée un ou deux menus déroulants listant les commandes d’une catégorie
 * @param {Client} client
 * @param {Interaction} interaction (facultatif au premier affichage)
 * @returns {Array<ActionRowBuilder>} liste de menus prêts à l’affichage
 */
function createCmdMenu(client, interaction) {

    // ——————————————————————————————————————————————
    // Récupération de la catégorie sélectionnée
    // ——————————————————————————————————————————————
    const selected =
        interaction?.values?.[0] ||
        interaction?.customId?.replace("helpmain-menu", "") ||
        null;

    if (!selected) return []; // rien à afficher si aucune catégorie choisie

    const category = selected.toLowerCase();

    // ——————————————————————————————————————————————
    // Récupération + tri des commandes
    // ——————————————————————————————————————————————
    const commandNames = client.commands
        .filter((cmd) => cmd.category === category)
        .map((cmd) => cmd.name)
        .sort((a, b) => a.localeCompare(b));

    if (commandNames.length === 0) {
        return [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("helpcmd-menu-empty")
                    .setPlaceholder("❌ Aucune commande disponible")
                    .setDisabled(true)
            ),
        ];
    }

    // ——————————————————————————————————————————————
    // Découpage en chunks de 20 (limite Discord)
    // ——————————————————————————————————————————————
    const chunk = (arr, size) =>
        arr.reduce((acc, _, i) => {
            if (i % size === 0) acc.push(arr.slice(i, i + size));
            return acc;
        }, []);

    const parts = chunk(commandNames, 20);

    const rows = parts.map((list, index) => {
        const select = new StringSelectMenuBuilder()
            .setCustomId(index === 0 ? "helpcmd-menu" : `helpcmd2-menu-${index}`)
            .setPlaceholder("Choisissez une commande");

        const options = list.map((cmdName) => ({
            label: cmdName.charAt(0).toUpperCase() + cmdName.slice(1),
            value: cmdName,
        }));

        select.addOptions(options);

        return new ActionRowBuilder().addComponents(select);
    });

    return rows;
}

module.exports = { createCmdMenu };
