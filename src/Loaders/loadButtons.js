const { glob } = require("glob");
const path = require("path");
const Logger = require("./Logger");

module.exports = async (client) => {
    client.buttons = new Map();

    const buttonFiles = await new Promise((resolve, reject) => {
        glob(
            path.join(process.cwd(), "src", "Buttons", "**", "*.js").replace(/\\/g, "/"),
            (err, files) => (err ? reject(err) : resolve(files))
        );
    });

    for (const file of buttonFiles) {
        try {
            delete require.cache[require.resolve(file)];
            const btn = require(file);

            if (!btn.name) {
                Logger.warn(`[BUTTON] Bouton ignoré : ajouter "name"\n Fichier -> ${file}`);
                continue;
            }

            if (typeof btn.runInteraction !== "function") {
                Logger.warn(`[BUTTON] Bouton "${btn.name}" ignoré : ajouter "runInteraction"\n Fichier -> ${file}`);
                continue;
            }

            client.buttons.set(btn.name, btn);
            Logger.button(`- ${btn.name}`);

        } catch (err) {
            Logger.error(`[BUTTON] Erreur lors du chargement : ${file}`);
            console.error(err);
        }
    }

    Logger.client(`✔ Boutons chargés : ${client.buttons.size}`);
};
