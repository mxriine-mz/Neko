require("dotenv").config();

module.exports = {
    name: "threadUpdate",
    once: false,

    async execute(client, oldThread, newThread) {
        try {
            // Si le thread vient d'être désarchivé → le bot rejoint
            if (oldThread.archived && !newThread.archived) {
                if (newThread.isTextBased() && !newThread.joined) {
                    await newThread.join().catch(() => {});
                }
            }

            // Récupération salon des logs
            const logId = process.env.LOG_ID;
            if (!logId) return;

            const logChannel = client.channels.cache.get(logId);
            if (!logChannel) {
                console.warn("[THREAD] LOG_ID introuvable ou invalide pour threadUpdate.");
                return;
            }

            await logChannel.send({
                content:
                    `🔄 **Thread mis à jour**\n` +
                    `> Nom : **${newThread.name}**\n` +
                    `> Archivé : **${newThread.archived ? "Oui" : "Non"}**`
            });

        } catch (err) {
            console.error("[THREAD] Erreur dans threadUpdate :", err);
        }
    },
};
