const { glob } = require("glob");
const path = require("path");
const Logger = require("./Logger");

module.exports = async (client) => {
    client.selects = new Map();

    const selectFiles = await new Promise((resolve, reject) => {
        glob(
            path.join(process.cwd(), "src", "Selects", "**", "*.js").replace(/\\/g, "/"),
            (err, files) => (err ? reject(err) : resolve(files))
        );
    });

    for (const file of selectFiles) {
        try {
            delete require.cache[require.resolve(file)];
            const selectMenu = require(file);

            // ————————————————————————————————
            // Vérifications
            // ————————————————————————————————
            if (!selectMenu.name) {
                Logger.warn(
                    `[SELECT] Menu ignoré : missing "name"\n Fichier -> ${file}`
                );
                continue;
            }

            if (typeof selectMenu.runInteraction !== "function") {
                Logger.warn(
                    `[SELECT] Menu "${selectMenu.name}" ignoré : missing "runInteraction()" \n Fichier -> ${file}`
                );
                continue;
            }

            // ————————————————————————————————
            // Ajout dans la Collection
            // ————————————————————————————————
            client.selects.set(selectMenu.name, selectMenu);
            Logger.select(`- ${selectMenu.name}`);

        } catch (err) {
            Logger.error(`[SELECT] Erreur lors du chargement : ${file}`);
            console.error(err);
        }
    }

    Logger.client(`✔ Menus Select chargés : ${client.selects.size}`);
};
