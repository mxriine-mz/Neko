const { PermissionFlagsBits, EmbedBuilder, MessageFlags } = require("discord.js");
const { createTicketButton } = require("../../Assets/Buttons/TicketButton.js");
require("dotenv").config();

module.exports = {
    name: "reopen-button",

    runInteraction: async (client, interaction, guildSettings, userSettings) => {
        const channel = interaction.channel;

        // ——————————————————————————————————————
        // Vérification : est-ce un ticket ?
        // ——————————————————————————————————————
        if (channel.parentId !== process.env.TICKET_CATEGORY_ID) {
            return interaction.reply({
                content: "❌ Ce channel n'est pas un ticket.",
                flags: MessageFlags.Ephemeral
            });
        }

        // ——————————————————————————————————————
        // Récupération de l’utilisateur concerné
        // ——————————————————————————————————————
        const ticketUser = channel.name.replace("ticket-", ""); 
        const member = interaction.guild.members.cache.find(m => 
            m.user.username.toLowerCase() === ticketUser.toLowerCase()
        );

        if (!member) {
            return interaction.reply({
                content: "⚠ Impossible de retrouver l'utilisateur d'origine du ticket.",
                flags: MessageFlags.Ephemeral
            });
        }

        // ——————————————————————————————————————
        // Modification des permissions → réouverture
        // ——————————————————————————————————————
        await channel.permissionOverwrites.edit(member.id, {
            ViewChannel: true,
            SendMessages: true,
        });

        // ——————————————————————————————————————
        // Réactivation des boutons
        // ——————————————————————————————————————
        const row = createTicketButton(interaction);

        // ——————————————————————————————————————
        // Mise à jour de la DB
        // ——————————————————————————————————————
        userSettings.ticket = true;
        await userSettings.save();

        // ——————————————————————————————————————
        // Embed confirmation
        // ——————————————————————————————————————
        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setDescription(`🔓 Le ticket a été **rouvert** pour **${member.user.username}** !`)
            .setFooter({ text: "Equipe Tokimeku" });

        await interaction.update({
            components: [row],
        });

        await interaction.followUp({ embeds: [embed] });

    }
};
