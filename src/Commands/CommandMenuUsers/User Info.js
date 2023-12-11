const { ApplicationCommandType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'User Info',
    category: 'commandmenuusers',
    type: ApplicationCommandType.User,
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: false,
    usage: 'Utiliser le menu contextuel de Discord pour voir les informations d\'un utilisateur',
    examples: ['Utiliser le menu contextuel de Discord pour voir les informations d\'un utilisateur'],

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const member = await interaction.guild.members.fetch(interaction.targetId);

        const embed = {

            color: 0x202225,
            author: {
                name: `${member.user.tag}`,
                icon_url: member.user.displayAvatarURL({ dynamic: true }),
            },
            description: `<@${member.id}>`,
            thumbnail: {
                url: member.user.displayAvatarURL({ dynamic: true}),
            },
            fields: [
                {
                    name: 'ID',
                    value: `${member.id}`,
                    inline: false,
                },
                {
                    name: 'Crée le',
                    value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)`,
                    inline: false,
                },
                {
                    name: 'Rejoint le',
                    value: `<t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`,
                    inline: false,
                },
                {
                    name: 'Modérateur',
                    value: `${member.kickable ? 'Non' : 'Oui'}`,
                    inline: true,
                },
                {
                    name: 'Bot',
                    value: `${member.user.bot ? 'Oui' : 'Non'}`,
                    inline: true,
                },
                {
                    name: `Roles [${member.roles.cache.size-1}]`,
                    value: `${member.roles.cache.map(role => role).join(', ').replace(', @everyone', ' ')}`,
                    inline: false,
                },
            ],
            timestamp: new Date(),
        };

        interaction.reply({ embeds: [embed], ephemeral: true });

    },

};