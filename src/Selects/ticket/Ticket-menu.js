const { ChannelType, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require("discord.js");
const { createTicketButton } = require("../../Assets/Buttons/TicketButton");

module.exports = {
    name: "ticket-menu",

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const categoryId = process.env.TICKET_CATEGORY_ID;

        const selected = interaction.values[0];
        const option = interaction.component.options.find(o => o.value === selected);
        const label = option.label;

        // L'utilisateur a déjà un ticket ?
        if (userSettings.ticket === true) {
            return interaction.reply({
                content: `Vous avez déjà un ticket ouvert.`,
                flags: MessageFlags.Ephemeral
            });
        }

        // CRÉATION DU SALON
        const ownerId = interaction.user.id;

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`.substring(0, 30),
            type: ChannelType.GuildText,
            parent: categoryId,
            permissionOverwrites: [
                {
                    id: ownerId,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel]
                }
            ]
        });

        const embed = new EmbedBuilder()
            .setColor(0x202225)
            .setTitle(`📨 TICKET | ${interaction.user.username}`)
            .setDescription(
`Votre ticket a été créé, ${interaction.user}.

**Raison :** ${label}

Merci de fournir toutes les informations utiles afin que nous puissions vous aider au mieux.`
            );

        // 🔥 ICI : ON TRANSMET ownerId AUX BOUTONS
        const components = [createTicketButton({ ownerId, isClosed: false })];

        // ENVOI DU MESSAGE PRINCIPAL
        const ticketMessage = await channel.send({
            embeds: [embed],
            components
        });

        // STOCKAGE EN DB
        await client.updateUser(interaction.user, {
            ticket: true,
            ticketMessageId: ticketMessage.id
        });

        await interaction.reply({
            content: `Votre ticket a été ouvert : <#${channel.id}>`,
            flags: MessageFlags.Ephemeral
        });
    }
};
