const { Collection } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message, client) {
        // Système anti-spam simple : avertissement auto puis ban auto
        if (!client._spamMap) client._spamMap = new Map();

        async function autoWarnAndBan(user, guild, reason, moderatorId) {
            const UserModel = require("../../Models/user.js");
            // Ajoute l'avertissement et récupère le nombre total d'avertissements en une seule opération atomique
            const updatedUser = await UserModel.findOneAndUpdate(
                { id: user.id },
                {
                    $set: { user: user.tag },
                    $push: { warnings: { reason, moderator: moderatorId } }
                },
                { new: true, upsert: true }
            );
            // Mute auto si 3 avertissements
            if (updatedUser.warnings.length >= 3) {
                const member = guild.members.cache.get(user.id);
                if (member && member.moderatable) {
                    // Message public avant le mute
                    const channel = member.guild.systemChannel || member.guild.channels.cache.find(c => c.isTextBased && c.permissionsFor(guild.members.me).has('SendMessages'));
                    if (channel) {
                        channel.send(`⚠️ ${member} a été mute automatiquement pour spam (${updatedUser.warnings.length} avertissements).`);
                    }
                    // Mute 10 minutes (timeout)
                    await member.timeout(10 * 60 * 1000, `Mute automatique : ${updatedUser.warnings.length} avertissements de spam`);
                }
            }
        }
        // ————————————————————————————————
        // Ignorer bots + DM
        // ————————————————————————————————
        if (!message.guild) return;
        if (message.author.bot) return;

        // Anti-spam : 5 messages en 10 secondes = warn auto
        const now = Date.now();
        const userId = message.author.id;
        if (!client._spamMap.has(userId)) client._spamMap.set(userId, []);
        const timestamps = client._spamMap.get(userId);
        timestamps.push(now);
        // Garder seulement les 10 dernières secondes
        while (timestamps.length && now - timestamps[0] > 10000) timestamps.shift();
        // Cooldown anti-warn : 1 warn max toutes les 15 secondes
        if (!client._warnCooldown) client._warnCooldown = new Map();
        const lastWarn = client._warnCooldown.get(userId) || 0;
        if (timestamps.length >= 5 && now - lastWarn > 15000) {
            // Récupérer les messages récents de l'utilisateur dans le salon
            let spamMessages = [];
            try {
                const fetched = await message.channel.messages.fetch({ limit: 100 });
                spamMessages = fetched.filter(m => m.author.id === userId && now - m.createdTimestamp < 10000);
                // Supprimer tous les messages de spam
                for (const msg of spamMessages.values()) {
                    try { await msg.delete(); } catch (_) {}
                }
            } catch (_) {}

            // Warn auto
            const UserModel = require("../../Models/user.js");
            let userData = await UserModel.findOne({ id: message.author.id });
            let warnCount = userData ? userData.warnings.length + 1 : 1;
            await autoWarnAndBan(message.author, message.guild, `Spam détecté (5 messages/10s)`, client.user.id);

            // Message éphémère à l'utilisateur
            try {
                await message.channel.send({
                    content: `⚠️ ${message.author}, tu as reçu un avertissement automatique pour spam. Total : ${warnCount}`,
                    ephemeral: true
                });
            } catch (_) {}

            // Envoyer en DM la liste des messages de spam
            try {
                const spamList = spamMessages.map(m => `• ${m.content}`).join("\n") || "(aucun contenu)";
                await message.author.send(
                    `⚠️ Tu as été averti automatiquement pour spam. Voici la liste de tes messages supprimés :\n${spamList}`
                );
            } catch (_) {}

            // Reset timestamps pour éviter spam infini
            client._spamMap.set(userId, []);
            client._warnCooldown.set(userId, now);
        }

        const prefix = process.env.PREFIX;
        if (!prefix) {
            console.error("Aucun prefix défini dans le .env");
            return;
        }

        // ...existing code...

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
