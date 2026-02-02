const { glob } = require("glob");
const path = require("path");
const Logger = require("./Logger");
const { Collection, ApplicationCommandType } = require("discord.js");

module.exports = async (client) => {
    client.commands = new Collection();       // Slash & Context Menu
    client.prefixCommands = new Collection(); // Prefix
    client.aliases = new Collection();

    const commandFiles = await new Promise((resolve, reject) => {
        glob(
            path.join(process.cwd(), "src", "Commands", "**", "*.js").replace(/\\/g, "/"),
            (err, files) => (err ? reject(err) : resolve(files))
        );
    });

    for (const file of commandFiles) {
        delete require.cache[require.resolve(file)];
        const cmd = require(file);

        if (!cmd.name) {
            Logger.warn(`[CMD] Commande ignorée : ajouter "name".\n Fichier -> ${file}`);
            continue;
        }

        // ————————————————————————
        // VALIDATION DU TYPE
        // ————————————————————————
        const isContextMenu =
            cmd.type === ApplicationCommandType.User ||
            cmd.type === ApplicationCommandType.Message;

        const isSlash = cmd.type === ApplicationCommandType.ChatInput;

        // ————————————————————————
        // GESTION DES DESCRIPTIONS
        // ————————————————————————

        if (isSlash) {
            // Slash → description obligatoire
            if (!cmd.description) {
                Logger.warn(`[CMD] Commande Slash ignorée : ajouter "description".\n Fichier -> ${file}`);
                continue;
            }
        } else if (isContextMenu) {
            // Context menu → description INTERDITE
            if (cmd.description) {
                Logger.warn(
                    `[CMD] Le context menu "${cmd.name}" ne doit PAS avoir de "description". Elle a été supprimée.`
                );
                delete cmd.description;
            }
        }

        let prefixLoaded = false;
        let slashLoaded = false;

        // ————————————————————————
        // PREFIX (run)
        // ————————————————————————
        if (typeof cmd.run === "function") {
            client.prefixCommands.set(cmd.name, cmd);

            if (cmd.aliases?.length) {
                for (const alias of cmd.aliases) {
                    client.aliases.set(alias.toLowerCase(), cmd.name);
                }
            }

            Logger.command(`[PREFIX] - ${cmd.name}`);
            prefixLoaded = true;
        }

        // ————————————————————————
        // SLASH + CONTEXT MENU (runInteraction)
        // ————————————————————————
        if (typeof cmd.runInteraction === "function") {
            client.commands.set(cmd.name, cmd);
            Logger.command(`[SLASH] - ${cmd.name}`);
            slashLoaded = true;
        }

        // ————————————————————————
        // Aucun mode détecté
        // ————————————————————————
        if (!prefixLoaded && !slashLoaded) {
            Logger.warn(`[CMD] Aucun mode (slash/prefix/context) pour "${cmd.name}"\n Fichier -> ${file}`);
        }
    }

    Logger.client(
        `✔ Commandes enregistrées : ${client.commands.size} slash | ${client.prefixCommands.size} prefix`
    );
};
