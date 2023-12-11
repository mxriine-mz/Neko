const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');


module.exports = {
    name: 'ban',
    category: 'moderation',
    permissions: PermissionFlagsBits.BanMembers,
    ownerOnly: false,
    usage: 'ban <@target> <raison>',
    examples: ['ban @.yumii spam', 'ban @.yumii flood'], 
    description: 'ban un utilisateur du serveur',

    run: async (client, message, args, guildSettings, userSettings) => {

        const target = message.mentions.users.find(m => m.id);
        const targetMember = message.mentions.members.find(m => m.id);
        const reason = args.slice(1).join(' ');

        if (!target) return message.channel.send('Merci de mentionner un utilisateur à kick');
        if (!targetMember.kickable) return message.reply('Cet utilisateur ne peut pas être kick');
        if (!reason) return message.channel.send('Merci de spécifier une raison');

        try {
            await target.send({ content: `**Vous avez été ban du serveur ${message.guild.name}**\`\`\`Raison : ${reason}\n\`\`\``});
        } catch (err) {}

        targetMember.ban({reason : reason });
        
        const raisonembed = {
            description:
            `**Raison du ban :** ${reason}`,
        }

        message.channel.send({ content: `**${target} a été ban** *!*`, embeds: [ raisonembed ]});
        
        const logbanembed = {
            author : {
                name: `Ban | ${target.tag}`,
                icon_url: message.author.displayAvatarURL({ dynamic: true }),
            },
            fields : [
                {
                    name: '± Utilisateur ban :',
                    value: `${target} \n *(\`${target.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Ban par :',
                    value: `${message.author} \n *(\`${message.author.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Raison :',
                    value: `${reason}`,
                    inline: false
                },
                {
                    name: '± Date :',
                    value: `\`${new Date().toLocaleString()}\``,
                    inline: true
                }
            ],

            timestamp: new Date(),
            footer: {
                text: `L'utilisateur a été ban du serveur`,
                icon_url: target.displayAvatarURL({ dynamic: true }),
            },
        }

        const logChannel = client.channels.cache.get(process.env.LOG_ID);
        logChannel.send({ embeds: [ logbanembed ]});

    },

    options: [
        {
            name: 'target',
            description: 'Utilisateur à ban',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'raison',
            description: 'Raison du ban',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const target = interaction.options.getUser('target');

        const targetMember = interaction.options.getMember('target');
        const reason = interaction.options.getString('raison');

        if (!targetMember.bannables) return interaction.reply('Cet utilisateur ne peut pas être kick');

        try {
            target.send({ content: `**Vous avez été ban du serveur ${interaction.guild.name}**\`\`\`Raison : ${reason}\n\`\`\``});
        } catch (err) {
            console.log(err);
        }

        target.ban({ reason });

        const raisonembed = {
            description:
            `**Raison du ban :** ${reason}`,
        }

        interaction.reply({ content: `**${target} a été ban** *!*`, embeds: [ raisonembed ]});

        const logbanembed = {
            author : {
                name: `Ban | ${target.tag}`,
                icon_url: interaction.user.displayAvatarURL({ dynamic: true }),
            },
            fields : [
                {
                    name: '± Utilisateur ban :',
                    value: `${target} \n *(\`${target.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Ban par :',
                    value: `${interaction.user} \n *(\`${interaction.user.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Raison :',
                    value: `${reason}`,
                    inline: false
                },
                {
                    name: '± Date :',
                    value: `\`${new Date().toLocaleString()}\``,
                    inline: true
                }
            ],

            timestamp: new Date(),
            footer: {
                text: `L'utilisateur a été ban du serveur`,
                icon_url: target.displayAvatarURL({ dynamic: true }),
            },
        }

        const logchannel = client.channels.cache.get(process.env.LOG_CHANNEL);
        logchannel.send({ embeds: [ logbanembed ]});

    }

};