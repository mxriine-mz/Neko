const { Collection } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "messageCreate",
    once: false,

    async execute(client, message) {
        // ————————————————————————————————
        // Ignorer bots + DM
        // ————————————————————————————————
        if (!message.guild) return;
        if (message.author.bot) return;

        const prefix = process.env.PREFIX;
        if (!prefix) {
            console.error("Aucun prefix défini dans le .env");
            return;
        }

        // ————————————————————————————————
        // Charger guildSettings / userSettings
        // ————————————————————————————————
        let guildSettings = await client.getGuild(message.guild).catch(() => null);
        if (!guildSettings) {
            await client.createGuild(message.guild);
            guildSettings = await client.getGuild(message.guild);
        }

        let userSettings = await client.getUser(message.author).catch(() => null);
        if (!userSettings) {
            await client.createUser(message.author);
            userSettings = await client.getUser(message.author);
        }

        // ————————————————————————————————
        // Vérifier le prefix
        // ————————————————————————————————
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        // ————————————————————————————————
        // Trouver la commande prefix
        // ————————————————————————————————
        const command =
            client.prefixCommands.get(commandName) ||
            client.prefixCommands.get(client.aliases.get(commandName));

        if (!command) return; // silencieux

        // ————————————————————————————————
        // Check owner
        // ————————————————————————————————
        if (command.ownerOnly && message.author.id !== process.env.OWNER_ID) {
            return message.reply("Seul le propriétaire du bot peut taper cette commande.");
        }

        // ————————————————————————————————
        // Check permissions Discord
        // ————————————————————————————————
        if (command.permissions) {
            if (!message.member.permissions.has(command.permissions)) {
                return message.reply({
                    content: `Permissions manquantes : \`${Object.keys(command.permissions).join(", ")}\``,
                });
            }
        }

        // ————————————————————————————————
        // Exécution
        // ————————————————————————————————
        try {
            if (typeof command.run !== "function") {
                return message.reply("Cette commande n’a pas de mode prefix.");
            }

            await command.run(client, message, args, guildSettings, userSettings);
        } catch (err) {
            console.error(err);
            message.reply("Erreur interne lors de l'exécution de la commande.");
        }
    },
};
