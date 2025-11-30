const { EmbedBuilder, MessageFlags } = require("discord.js");
const { createTicketButton } = require("../../Assets/Buttons/TicketButton");

module.exports = {
    name: "reopen-button",

    runInteraction: async (client, interaction) => {

        await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
            SendMessages: true
        });

        const userData = await client.getUser(interaction.user.id);
        const main = await interaction.channel.messages.fetch(userData.ticketMessageId);

        await main.edit({
            components: [createTicketButton({ isClosed: false })]
        });

        await interaction.reply({
            content: "🔓 Ticket rouvert.",
            flags: MessageFlags.Ephemeral
        });

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Ticket rouvert par <@${interaction.user.id}>`);

        return interaction.channel.send({ embeds: [embed] });
    }
};
