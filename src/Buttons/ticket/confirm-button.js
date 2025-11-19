const { PermissionFlagsBits, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
    name: "confirm-button",

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const channel = interaction.channel;

        // —————————————— Sécurité : vérifier que c’est un ticket ——————————————
        if (channel.parentId !== process.env.TICKET_CATEGORY_ID) {
            return interaction.reply({
                content: "❌ Ce channel n'est pas un ticket.",
                flags: MessageFlags.Ephemeral
            });
        }

        // —————————————— Disable du bouton ——————————————
        const row = interaction.message.components[0]; // on récupère EXACTEMENT les bons boutons
        const closeBtn = row.components[0];
        const reopenBtn = row.components[1];

        closeBtn.setDisabled(true);
        reopenBtn.setDisabled(false);

        // —————————————— Embed de fermeture ——————————————
        const embed = new EmbedBuilder()
            .setColor(0x202225)
            .setDescription(
                `**${interaction.user.username}**, vous avez fermé ce ticket.\n` +
                `Celui-ci est désormais archivé dans **辰, TICKETS _**.`
            )
            .setFooter({ text: "Equipe Tokimeku" });

        // —————————————— MAJ des permissions ——————————————
        await channel.edit({
            permissionOverwrites: [
                // Auteur du ticket : lecture OUI / écriture NON
                {
                    id: interaction.user.id,
                    deny: [PermissionFlagsBits.SendMessages],
                    allow: [PermissionFlagsBits.ViewChannel],
                },
                // Everyone
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                }
            ]
        });

        // —————————————— MAJ des boutons ——————————————
        await interaction.update({ components: [row] });

        // —————————————— Message dans le ticket ——————————————
        await interaction.followUp({ embeds: [embed] });

        // —————————————— MAJ DB ——————————————
        userSettings.ticket = false;
        await userSettings.save();
    }
};
