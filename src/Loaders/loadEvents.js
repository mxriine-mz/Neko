const { glob } = require("glob");
const path = require("path");
const Logger = require("./Logger"); // Chemin corrigé

module.exports = async (client) => {
    const eventFiles = await new Promise((resolve, reject) => {
        glob(
            path.join(process.cwd(), "src", "Events", "**", "*.js").replace(/\\/g, "/"),
            (err, files) => (err ? reject(err) : resolve(files))
        );
    });

    for (const file of eventFiles) {
        try {
            delete require.cache[require.resolve(file)];
            const event = require(file);

            // ——————————————————————————————————————
            // Vérifications de base
            // ——————————————————————————————————————
            if (!event.name) {
                Logger.warn(`[EVT] Ignoré : missing "name"\n Fichier -> ${file}`);
                continue;
            }

            if (typeof event.execute !== "function") {
                Logger.warn(`[EVT] Ignoré : missing "execute()" \n Fichier -> ${file}`);
                continue;
            }

            // ——————————————————————————————————————
            // Enregistrement event
            // ——————————————————————————————————————
            const handler = (...args) => event.execute(...args, client);

            if (event.once) client.once(event.name, handler);
            else client.on(event.name, handler);

            Logger.event(`- ${event.name}`);

        } catch (err) {
            Logger.error(`[EVT] Erreur lors du chargement : ${file}`);
            console.error(err);
        }
    }

    Logger.client("✔ Évènements chargés");
};
