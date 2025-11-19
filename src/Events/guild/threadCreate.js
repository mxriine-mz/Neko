require("dotenv").config();

module.exports = {
    name: "threadCreate",
    once: false,

    async execute(client, thread) {
        try {
            // On ne rejoint que les threads textuels
            if (thread.isTextBased() && !thread.joined) {
                await thread.join().catch(() => {});
            }

            const logId = process.env.LOG_ID;
            if (!logId) return;

            const logChannel = client.channels.cache.get(logId);
            if (!logChannel) {
                console.warn(`[THREAD] LOG_ID invalide ou channel introuvable.`);
                return;
            }

            await logChannel.send({
                content: `🧵 **Nouveau thread créé**\n> Nom : **${thread.name}**\n> Salon : <#${thread.parentId}>`
            });

        } catch (err) {
            console.error("[THREAD] Erreur dans threadCreate :", err);
        }
    },
};
