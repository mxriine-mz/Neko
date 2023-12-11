const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'unmute',
    category: 'moderation',
    permissions: PermissionFlagsBits.ModerateMembers,
    ownerOnly: false,
    usage: 'unmute <@target>',
    examples: ['unmute @.yumii'], 
    description: 'Unmute un utilisateur du serveur temporairement',

    run: async (client, message, args, guildSettings, userSettings) => {

        const target = message.mentions.users.find(m => m.id);
        const targetMember = message.mentions.members.find(m => m.id);

        if (!target) return message.channel.send('Merci de mentionner un utilisateur à unmute');
        if (!targetMember.isCommunicationDisabled()) return message.reply('Cet utilisateur ne peut pas être unmute *(il n\'est pas mute)*');

        targetMember.timeout(null);

        message.channel.send({ content: `**${target} a été unmute**`});
        
        const logbanembed = {
            author : {
                name: `Unmute | ${target.tag}`,
                icon_url: message.author.displayAvatarURL({ dynamic: true }),
            },
            fields : [
                {
                    name: '± Utilisateur unmute :',
                    value: `${target} \n *(\`${target.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Unmute par :',
                    value: `${message.author} \n *(\`${message.author.id}\`)*`,
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: '± Date :',
                    value: `\`${new Date().toLocaleString()}\``,
                    inline: false
                }
            ],

            timestamp: new Date(),
            footer: {
                text: `L'utilisateur a été unmute du serveur`,
                icon_url: target.displayAvatarURL({ dynamic: true }),
            },
        }

        const logChannel = client.channels.cache.get(process.env.LOG_ID);
        logChannel.send({ embeds: [ logbanembed ]});

    },

    options: [
        {
            name: 'target',
            description: 'Utilisateur à unmute',
            type: ApplicationCommandOptionType.User,
            required: true
        },
    ],

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const target = interaction.options.getUser('target');
        const targetMember = interaction.options.getMember('target');

        if (!target) return interaction.reply('Merci de mentionner un utilisateur à unmute');
        if (!targetMember.isCommunicationDisabled()) return interaction.reply('Cet utilisateur ne peut pas être unmute *(il n\'est pas mute)*');

        targetMember.timeout(null);

        interaction.reply({ content: `**${target} a été unmute**`});
        
        const logbanembed = {
            author : {
                name: `Unmute | ${target.tag}`,
                icon_url: interaction.users.displayAvatarURL({ dynamic: true }),
            },
            fields : [
                {
                    name: '± Utilisateur unmute :',
                    value: `${target} \n *(\`${target.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Unmute par :',
                    value: `${interaction.users} \n *(\`${interaction.users.id}\`)*`,
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: '± Date :',
                    value: `\`${new Date().toLocaleString()}\``,
                    inline: false
                }
            ],

            timestamp: new Date(),
            footer: {
                text: `L'utilisateur a été unmute du serveur`,
                icon_url: target.displayAvatarURL({ dynamic: true }),
            },
        }

        const logChannel = client.channels.cache.get(process.env.LOG_ID);
        logChannel.send({ embeds: [ logbanembed ]});

    }

};