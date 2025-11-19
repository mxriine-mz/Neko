const { ChannelType, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { createTicketMenu } = require("../../Assets/SelectMenu/TicketMenu");
const { createTicketButton } = require("../../Assets/Buttons/TicketButton");
require("dotenv").config();

module.exports = {
    name: "ticket-menu",

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const categoryId = process.env.TICKET_CATEGORY_ID;
        if (!categoryId)
            return interaction.reply({
                content: "❌ Configuration ticket invalide : aucune catégorie définie.",
                ephemeral: true
            });

        const reason = interaction.values[0];
        const ticketMenu = createTicketMenu(client);
        const ticketButtons = createTicketButton();

        // ——————————————————————————————————————
        // Empêcher les tickets en doublon
        // ——————————————————————————————————————
        if (userSettings.ticket === true) {
            return interaction.reply({
                content: `**${interaction.user.username}**, vous avez déjà un ticket ouvert.`,
                ephemeral: true
            });
        }

        // ——————————————————————————————————————
        // Créer le channel du ticket
        // ——————————————————————————————————————
        let channel;
        try {
            channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`.substring(0, 30),
                type: ChannelType.GuildText,
                parent: categoryId,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                ],
            });
        } catch (e) {
            console.error(e);
            return interaction.reply({
                content: "❌ Impossible de créer le ticket (permissions manquantes).",
                ephemeral: true
            });
        }

        // ——————————————————————————————————————
        // Embed du ticket
        // ——————————————————————————————————————
        const embed = new EmbedBuilder()
            .setColor(0x202225)
            .setTitle(`🎫 TICKET | ${interaction.user.username}`)
            .setDescription(
                `Votre ticket a été créé, ${interaction.user}.  

**Raison :** ${reason}

> Merci de fournir toutes les informations utiles afin que nous puissions vous aider au mieux.`
            )
            .setTimestamp()
            .setFooter({
                text: "Equipe Tokimeku",
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
            });

        // ——————————————————————————————————————
        // Mise à jour BDD
        // ——————————————————————————————————————
        await client.updateUser(interaction.user, { ticket: true });

        // ——————————————————————————————————————
        // Mettre à jour le menu (optionnel)
        // ——————————————————————————————————————
        await interaction.update({ components: [ticketMenu] });

        // ——————————————————————————————————————
        // Message confirmation utilisateur
        // ——————————————————————————————————————
        await interaction.followUp({
            content: `**${interaction.user.username}**, votre ticket a été ouvert : <#${channel.id}>`,
            ephemeral: true,
        });

        // ——————————————————————————————————————
        // Message dans le ticket
        // ——————————————————————————————————————
        await channel.send({
            embeds: [embed],
            components: [ticketButtons],
        });
    },
};
