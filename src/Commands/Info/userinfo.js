const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'userinfo',
    category: 'info',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: false,
    usage: 'userinfo <@user>',
    examples: ['userinfo @user', 'userinfo 123456789012345678', 'userinfo'],
    description: 'Affiche les informations d\'un utilisateur',

    run: async (client, message, args, guildSettings, userSettings) => {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const embed = {

            color: 0x202225,
            author: {
                name: `${member.user.tag}`,
                icon_url: member.user.displayAvatarURL({ dynamic: true }),
            },
            description: member.displayName,
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

        message.channel.send({ embeds: [embed] });
    },


    options: [
        {
            name: 'user',
            description: 'Choisir un utilisateur',
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const member = interaction.options.getMember('user');

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

        interaction.reply({ embeds: [embed] });

},

};