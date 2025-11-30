const { EmbedBuilder, MessageFlags } = require("discord.js");
const { createTicketButton } = require("../../Assets/Buttons/TicketButton");

module.exports = {
    name: "close-confirm-button",

    runInteraction: async (client, interaction) => {

        console.log("===============================================");
        console.log("🔥 CLOSE-CONFIRM BUTTON DEBUG START");
        console.log("===============================================");

        // 1 — customId complet
        console.log("CUSTOM ID (raw) =", interaction.customId);

        const [prefix, ownerId] = interaction.customId.split(":");

        // 2 — ownerId isolé
        console.log("OWNER ID (parsed) =", ownerId);

        // 3 — Vérifier si l’utilisateur qui clique est bien autorisé
        console.log("CLICK USER ID =", interaction.user.id);

        // 4 — Vérifier si le salon existe
        console.log("CHANNEL ID =", interaction.channel.id);
        console.log("CHANNEL NAME =", interaction.channel.name);

        // 5 — Vérifier permission overwrite
        try {
            console.log("PERMISSIONS BEFORE EDIT =", interaction.channel.permissionOverwrites.cache.get(ownerId));
        } catch (err) {
            console.log("⚠️ Impossible de lire permissions avant edit:", err);
        }

        // 6 — Test de récupération du user en DB
        console.log(">>> DEMANDE DB : client.getUser(", ownerId, ")");
        const userData = await client.getUser(ownerId);
        console.log("USER DATA FROM DB =", userData);

        if (!userData) {
            console.log("❌ userData = NULL !!!");
            return interaction.reply({
                content: "❌ userData est null — problème DB.",
                flags: MessageFlags.Ephemeral
            });
        }

        // 7 — Voir contenu exact de userData
        console.log("userData.id =", userData.id);
        console.log("userData.ticketMessageId =", userData.ticketMessageId);
        console.log("userData.ticket =", userData.ticket);

        if (!userData.ticketMessageId) {
            console.log("❌ ticketMessageId est NULL !!!");
            return interaction.reply({
                content: "❌ ticketMessageId absent dans la DB.",
                flags: MessageFlags.Ephemeral
            });
        }

        // 8 — Test fetch du message principal
        console.log(">>> FETCH TICKET MESSAGE :", userData.ticketMessageId);
        let main;
        try {
            main = await interaction.channel.messages.fetch(userData.ticketMessageId);
            console.log("MAIN MESSAGE FOUND =", main.id);
        } catch (err) {
            console.log("❌ ERREUR FETCH MAIN MESSAGE =", err);
            return interaction.reply({
                content: "❌ Message principal introuvable dans ce salon.",
                flags: MessageFlags.Ephemeral
            });
        }

        // 9 — Fermeture (permissions)
        console.log(">>> EDIT PERMISSIONS pour ownerId =", ownerId);
        try {
            await interaction.channel.permissionOverwrites.edit(ownerId, {
                SendMessages: false
            });
            console.log("✔ Permissions éditées.");
        } catch (err) {
            console.log("❌ ERREUR EDIT PERMISSIONS =", err);
            return interaction.reply({
                content: "❌ Impossible d’éditer les permissions.",
                flags: MessageFlags.Ephemeral
            });
        }

        // 10 — Mise à jour du message ephemeral
        console.log(">>> UPDATE ephemeral confirm message");
        await interaction.update({
            content: "🔒 Ticket fermé.",
            components: []
        });

        // 11 — Mise à jour du message principal
        console.log(">>> UPDATE MAIN MESSAGE");
        try {
            await main.edit({
                components: [createTicketButton({ ownerId, isClosed: true })]
            });
            console.log("✔ MAIN MESSAGE UPDATED");
        } catch (err) {
            console.log("❌ ERREUR UPDATE MAIN MESSAGE =", err);
        }

        // 12 — Message final de log
        console.log(">>> SEND CLOSING EMBED");
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Ticket fermé par <@${interaction.user.id}>`);

        await interaction.channel.send({ embeds: [embed] });

        console.log("===============================================");
        console.log("🔥 CLOSE-CONFIRM BUTTON DEBUG END");
        console.log("===============================================");
    }
};
