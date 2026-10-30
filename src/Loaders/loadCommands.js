const { glob } = require("glob");
const path = require("path");
const Logger = require("./Logger");
const { Collection, ApplicationCommandType } = require("discord.js");

module.exports = async (client) => {
    try {
        client.commands = new Collection();       // Slash & Context Menu
        client.prefixCommands = new Collection(); // Prefix
        client.aliases = new Collection();

        const pattern = path.join(process.cwd(), "src", "Commands", "**", "*.js").replace(/\\/g, "/");
        const commandFiles = await glob(pattern);

        for (const file of commandFiles) {
            try {
                delete require.cache[require.resolve(file)];
                const cmd = require(file);

                // Support pour les deux formats : cmd.name et cmd.data.name
                const commandName = cmd.name || cmd.data?.name;
                
                if (!commandName) {
                    Logger.warn(`[CMD] Commande ignorée : ajouter "name" ou "data.name".\n Fichier -> ${file}`);
                    continue;
                }

                // Définir cmd.name pour compatibilité
                if (!cmd.name && cmd.data?.name) {
                    cmd.name = cmd.data.name;
                }

                // Support pour cmd.data.description
                const commandDescription = cmd.description || cmd.data?.description;

                // Validation du type (le type peut être porté par cmd.type ou par cmd.data.type,
                // selon que la commande est construite avec un ContextMenuCommandBuilder ou non)
                const resolvedType = cmd.type ?? cmd.data?.type;
                const isContextMenu =
                    resolvedType === ApplicationCommandType.User ||
                    resolvedType === ApplicationCommandType.Message;

                const isSlash = !isContextMenu && !!cmd.data;

                // Gestion des descriptions
                if (isSlash) {
                    if (!commandDescription) {
                        Logger.warn(`[CMD] Commande Slash ignorée : ajouter "description".\n Fichier -> ${file}`);
                        continue;
                    }
                } else if (isContextMenu) {
                    if (commandDescription) {
                        Logger.warn(
                            `[CMD] Le context menu "${commandName}" ne doit PAS avoir de "description". Elle a été supprimée.`
                        );
                        delete cmd.description;
                    }
                }

                // Vérification de la fonction execute
                if (typeof cmd.runSlash !== "function" && 
                    typeof cmd.execute !== "function" && 
                    typeof cmd.runInteraction !== "function" &&
                    typeof cmd.run !== "function") {
                    Logger.warn(`[CMD] Commande "${commandName}" ignorée : ajouter "runSlash", "execute", "runInteraction" ou "run".\n Fichier -> ${file}`);
                    continue;
                }

                // Enregistrement de la commande
                client.commands.set(commandName, cmd);

                // Gestion des alias (pour prefix commands)
                if (cmd.aliases && Array.isArray(cmd.aliases)) {
                    cmd.aliases.forEach((alias) => {
                        client.aliases.set(alias, commandName);
                    });
                }

                Logger.command(`- ${commandName}`);
            } catch (err) {
                Logger.error(`[CMD] Erreur lors du chargement : ${file}`);
                console.error(err);
            }
        }

        const slashCount = Array.from(client.commands.values()).filter(cmd => cmd.data).length;
        const prefixCount = Array.from(client.commands.values()).filter(cmd => 
            typeof cmd.run === "function"
        ).length;
        
        if (client.commands.size > 0) {
            Logger.client(`✔ Commandes enregistrées : ${slashCount} slash | ${prefixCount} prefix`);
        }
    } catch (error) {
        Logger.error(`Erreur dans loadCommands: ${error.message}`);
        console.error(error);
    }
};
