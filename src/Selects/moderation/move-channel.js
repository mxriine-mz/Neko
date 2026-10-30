const { PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, MessageFlags } = require('discord.js');
const { FORUM_TYPES, THREADED_TYPES, listThreads, moveMessage } = require('../../Assets/Functions/moveMessage');

// Étape 1 de "Déplacer" (custom id: move:srcChannelId:messageId) : un salon de
// destination a été choisi. Propose ses posts/threads, ou déplace directement
// si le salon choisi est un salon classique sans thread.
module.exports = {
    data: { name: 'move' },

    async execute(client, interaction) {
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: '❌ Réservé aux modérateurs.', flags: MessageFlags.Ephemeral });
        }

        const [, srcChannelId, messageId] = interaction.customId.split(':');
        const targetId = interaction.values[0];
        const target = await interaction.guild.channels.fetch(targetId).catch(() => null);
        if (!target) {
            return interaction.update({ content: '❌ Salon introuvable.', components: [] });
        }

        const isForum = FORUM_TYPES.has(target.type);
        const threads = THREADED_TYPES.has(target.type) ? await listThreads(target) : [];

        // Salon classique sans thread → pas besoin d'une seconde étape.
        if (!isForum && !threads.length) {
            await interaction.deferUpdate();
            await moveMessage(interaction, srcChannelId, messageId, target);
            return;
        }

        const rootOption = isForum
            ? { label: 'Nouveau post', value: '__root__', emoji: '📝', description: 'Créer un nouveau post dans le forum' }
            : { label: `# ${target.name}`, value: '__root__', description: 'Poster directement dans le salon' };

        const options = [
            rootOption,
            ...threads.map((t) => ({
                label: t.name.slice(0, 100),
                value: t.id,
                description: t.archived ? 'post archivé' : 'post ouvert'
            }))
        ].slice(0, 25);

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`movethread:${srcChannelId}:${messageId}:${targetId}`)
                .setPlaceholder(isForum ? 'Choisis un post (ou un nouveau)' : 'Choisis un fil (ou le salon)')
                .addOptions(options)
        );

        await interaction.update({
            content: `Destination : **${target.name}** — choisis le post/fil :`,
            components: [row]
        });
    }
};
