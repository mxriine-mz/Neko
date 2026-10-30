const { PermissionFlagsBits, MessageFlags } = require('discord.js');
const { moveMessage } = require('../../Assets/Functions/moveMessage');

// Étape 2 de "Déplacer" (custom id: movethread:srcChannelId:messageId:targetId) :
// un post/thread précis (ou la racine du salon) a été choisi.
module.exports = {
    data: { name: 'movethread' },

    async execute(client, interaction) {
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: '❌ Réservé aux modérateurs.', flags: MessageFlags.Ephemeral });
        }

        const [, srcChannelId, messageId, targetId] = interaction.customId.split(':');
        const choice = interaction.values[0];
        const destId = choice === '__root__' ? targetId : choice;
        await interaction.deferUpdate();

        const dest = await interaction.guild.channels.fetch(destId).catch(() => null);
        if (!dest) {
            await interaction.editReply({ content: '❌ Destination introuvable.', components: [] });
            return;
        }

        await moveMessage(interaction, srcChannelId, messageId, dest);
    }
};
