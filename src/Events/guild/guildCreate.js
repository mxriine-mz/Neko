require("dotenv").config();

module.exports = {
    name: "guildCreate",
    once: false,

    async execute(client, guild) {
        try {
            // Si déjà dans la DB → ne pas dupliquer
            const exists = await client.getGuild(guild);
            if (!exists) {
                await client.createGuild(guild);
                client.logger?.client?.(`[GUILD] Nouveau serveur ajouté : ${guild.name} (${guild.id})`);
            } else {
                client.logger?.client?.(`[GUILD] Serveur déjà existant en DB : ${guild.name}`);
            }
        } catch (err) {
            console.error(`[GUILD] Erreur dans guildCreate :`, err);
        }
    }
};
