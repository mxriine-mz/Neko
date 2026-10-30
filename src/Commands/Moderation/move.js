const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType,
    PermissionFlagsBits,
    MessageFlags
} = require('discord.js');

/**
 * Menu contextuel "Déplacer" — clic droit sur un message → Applications →
 * Déplacer, puis choix du salon de destination.
 * Le déplacement effectif (copie webhook + suppression de l'original) est
 * géré par les selects src/Selects/moderation/move-channel.js et move-thread.js.
 */
module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Déplacer')
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),

    category: 'Moderation',
    permissions: PermissionFlagsBits.ManageMessages,

    async execute(client, interaction) {
        const message = interaction.targetMessage;

        // Étape 1 : choisir une destination. Salons, forums ET posts/threads sont
        // acceptés : Discord ne liste pas forcément tous les threads d'emblée, mais
        // dès qu'on tape le nom d'un post, il le trouve — un modérateur peut donc
        // viser directement un post précis. Choisir un forum/salon propose ses
        // posts dans une seconde étape (voir Selects/moderation/move-channel.js).
        const row = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId(`move:${message.channelId}:${message.id}`)
                .setPlaceholder('Salon, forum ou post (tape le nom pour chercher)')
                .addChannelTypes(
                    ChannelType.GuildText,
                    ChannelType.GuildAnnouncement,
                    ChannelType.GuildForum,
                    ChannelType.GuildMedia,
                    ChannelType.PublicThread,
                    ChannelType.PrivateThread,
                    ChannelType.AnnouncementThread
                )
                .setMinValues(1)
                .setMaxValues(1)
        );

        await interaction.reply({
            content: `Déplacer le message de ${message.author} vers… ?`,
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
};
