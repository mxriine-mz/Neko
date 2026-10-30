const { ChannelType } = require('discord.js');

/**
 * Logique partagée de l'action "Déplacer" (menu contextuel sur un message).
 * Le message est recopié via un webhook (même pseudo/avatar que l'auteur)
 * dans le salon/thread/post cible, puis l'original est supprimé.
 * Le bot a besoin de "Gérer les webhooks" sur le salon cible et
 * "Gérer les messages" sur le salon source.
 * Les réactions d'origine sont réappliquées par le bot (auteurs/compteurs non
 * transférables) ; l'historique des modifications n'est pas conservé.
 */

const FORUM_TYPES = new Set([ChannelType.GuildForum, ChannelType.GuildMedia]);
const THREADED_TYPES = new Set([
    ChannelType.GuildText,
    ChannelType.GuildAnnouncement,
    ChannelType.GuildForum,
    ChannelType.GuildMedia
]);

// Plus récent en premier par snowflake (un post tout juste créé a l'id le plus élevé),
// pour ne jamais masquer un post que le modérateur vient de créer.
function newestFirst(list) {
    return [...list].sort((a, b) => (BigInt(b.id) > BigInt(a.id) ? 1 : -1));
}

// Threads actifs + récents archivés (publics) d'un salon, dédupliqués, plafonnés à 24
// (Discord autorise 25 options de select ; une est réservée à la racine du salon).
async function listThreads(channel, cap = 24) {
    if (!channel?.threads) return [];

    const active = new Map();
    try {
        const open = await channel.threads.fetchActive();
        for (const t of open.threads.values()) active.set(t.id, t);
    } catch {
        // ignore
    }
    let result = newestFirst(active.values());

    if (result.length < cap) {
        try {
            const archived = await channel.threads.fetchArchived({ type: 'public', limit: 25 });
            const extra = newestFirst([...archived.threads.values()].filter((t) => !active.has(t.id)));
            result = result.concat(extra);
        } catch {
            // ignore
        }
    }

    return result.slice(0, cap);
}

// Déplacement effectif : copie webhook du message dans `target`, puis suppression de l'original.
// Suppose que l'interaction a déjà été deferée/update.
async function moveMessage(interaction, srcChannelId, messageId, target) {
    const guild = interaction.guild;
    const source = await guild.channels.fetch(srcChannelId).catch(() => null);
    const message = source?.isTextBased() ? await source.messages.fetch(messageId).catch(() => null) : null;

    const isForum = FORUM_TYPES.has(target?.type);
    if (!message || (!target?.isTextBased() && !isForum)) {
        await interaction.editReply({ content: '❌ Message ou salon introuvable.', components: [] });
        return;
    }

    // Les webhooks vivent sur le salon réel, pas sur un thread. Pour un thread/post de
    // forum, on crée le webhook sur son parent et on poste dans le thread via threadId.
    const isThread = typeof target.isThread === 'function' && target.isThread();
    const webhookChannel = isThread
        ? target.parent ?? (await guild.channels.fetch(target.parentId).catch(() => null))
        : target;

    if (!webhookChannel?.createWebhook) {
        await interaction.editReply({ content: '❌ Salon de destination invalide.', components: [] });
        return;
    }

    let webhook;
    try {
        webhook = await webhookChannel.createWebhook({ name: 'Neko — déplacement' });
    } catch {
        await interaction.editReply({
            content: '❌ Impossible de créer un webhook — le bot a-t-il « Gérer les webhooks » sur le salon cible ?',
            components: []
        });
        return;
    }

    let sent;
    try {
        const sendOptions = {
            username: (message.member?.displayName ?? message.author.username).slice(0, 80),
            avatarURL: message.author.displayAvatarURL(),
            content: message.content || undefined,
            files: [...message.attachments.values()],
            embeds: message.embeds,
            allowedMentions: { parse: [] }
        };
        if (isThread) {
            // Poste dans le thread / post de forum existant.
            sendOptions.threadId = target.id;
        } else if (isForum) {
            // Racine d'un forum/media : crée un nouveau post (thread) avec un titre.
            const firstLine = message.content?.split('\n')[0]?.trim();
            sendOptions.threadName = (firstLine || `Message de ${message.author.username}`).slice(0, 100);
        }
        sent = await webhook.send(sendOptions);
    } catch (error) {
        console.error('Erreur move — envoi webhook:', error);
        await interaction.editReply({ content: '❌ Échec de la copie du message.', components: [] });
        await webhook.delete().catch(() => {});
        return;
    }

    await webhook.delete().catch(() => {});

    // Réapplique les réactions d'origine en tant que bot. Discord ne peut pas transférer
    // l'auteur/le compteur d'une réaction : c'est cosmétique, le compteur repart à 1.
    if (sent && message.reactions.cache.size) {
        for (const reaction of message.reactions.cache.values()) {
            await sent.react(reaction.emoji).catch(() => {});
        }
    }

    const deleted = await message.delete().then(() => true).catch(() => false);

    await interaction.editReply({
        content: `✅ Message déplacé vers ${target}.${deleted ? '' : ' ⚠️ (original non supprimé — permission « Gérer les messages » manquante)'}`,
        components: []
    });
}

module.exports = { FORUM_TYPES, THREADED_TYPES, listThreads, moveMessage };
