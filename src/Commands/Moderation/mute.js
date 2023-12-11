const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'mute',
    category: 'moderation',
    permissions: PermissionFlagsBits.ModerateMembers,
    ownerOnly: false,
    usage: 'mute <@target> <duree> <raison>',
    examples: ['mute @.yumii 4 minutes spam'], 
    description: 'Mute un utilisateur du serveur temporairement',

    run: async (client, message, args, guildSettings, userSettings) => {

        const target = message.mentions.users.find(m => m.id);
        const targetMember = message.mentions.members.find(m => m.id);
        const duration = args.slice(1, 3).join(' ');
        const reason = args.slice(3).join(' ');

        const convertedTime = ms(duration);

        if (!target) return message.channel.send('Merci de mentionner un utilisateur à mute');
        if (!targetMember.moderatable) return message.reply('Cet utilisateur ne peut pas être mute');

        if(!args[1] || !args[2]) return message.channel.send('Merci de spécifier une durée pour votre mute');

        if (!reason) return message.channel.send('Merci de spécifier une raison');

        try {
            await target.send({ content: `**Vous avez été mute du serveur ${message.guild.name}**\`\`\`Durée : ${duration} \nRaison : ${reason}\n\`\`\``});
        } catch (err) {}

        targetMember.timeout(convertedTime, reason);
        
        const raisonembed = {
            description:
            `**Raison du mute :** ${reason}`,
        }

        message.channel.send({ content: `**${target} a été mute pour ${duration}** *!*`, embeds: [ raisonembed ]});
        
        const logbanembed = {
            author : {
                name: `Mute | ${target.tag}`,
                icon_url: message.author.displayAvatarURL({ dynamic: true }),
            },
            fields : [
                {
                    name: '± Utilisateur mute :',
                    value: `${target} \n *(\`${target.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Mute par :',
                    value: `${message.author} \n *(\`${message.author.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Raison :',
                    value: `${reason}`,
                    inline: true
                },
                {
                    name: '± Durée :',
                    value: `${duration} jours`,
                    inline: true
                },
                {
                    name: '± Date :',
                    value: `\`${new Date().toLocaleString()}\``,
                    inline: true
                }
            ],

            timestamp: new Date(),
            footer: {
                text: `L'utilisateur a été mute du serveur`,
                icon_url: target.displayAvatarURL({ dynamic: true }),
            },
        }

        const logChannel = client.channels.cache.get(process.env.LOG_ID);
        logChannel.send({ embeds: [ logbanembed ]});

    },

    options: [
        {
            name: 'target',
            description: 'Utilisateur à mute',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'duration',
            description: 'Durée du mute',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'raison',
            description: 'Raison du mute',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const target = interaction.options.getUser('target');
        const targetMember = interaction.options.getMember('target');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('raison');

        const convertedTime = ms(duration);

        if(!convertedTime) return interaction.reply('Merci de spécifier une durée valide');

        if (!target) return interaction.reply('Merci de mentionner un utilisateur à mute');
        if (!targetMember.moderatable) return interaction.reply('Cet utilisateur ne peut pas être mute');

        if(!args[1] || !args[2]) return interaction.reply('Merci de spécifier une durée pour votre mute');

        if (!reason) return interaction.reply('Merci de spécifier une raison');

        try {
            await target.send({ content: `**Vous avez été mute du serveur ${interaction.guild.name}**\`\`\`Durée : ${duration} jours \nRaison : ${reason}\n\`\`\``});
        } catch (err) {}

        targetMember.timeout(convertedTime, reason);
        
        const raisonembed = {
            description:
            `**Raison du mute :** ${reason}`,
        }

        interaction.reply({ content: `**${target} a été mute pour ${duration}** *!*`, embeds: [ raisonembed ]});
        
        const logbanembed = {
            author : {
                name: `Mute | ${target.tag}`,
                icon_url: interaction.users.displayAvatarURL({ dynamic: true }),
            },
            fields : [
                {
                    name: '± Utilisateur mute :',
                    value: `${target} \n *(\`${target.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Mute par :',
                    value: `${interaction.users} \n *(\`${interaction.users.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Raison :',
                    value: `${reason}`,
                    inline: true
                },
                {
                    name: '± Durée :',
                    value: `${duration} jours`,
                    inline: true
                },
                {
                    name: '± Date :',
                    value: `\`${new Date().toLocaleString()}\``,
                    inline: true
                }
            ],

            timestamp: new Date(),
            footer: {
                text: `L'utilisateur a été mute du serveur`,
                icon_url: target.displayAvatarURL({ dynamic: true }),
            },
        }

        const logChannel = client.channels.cache.get(process.env.LOG_ID);
        logChannel.send({ embeds: [ logbanembed ]});
    }

};