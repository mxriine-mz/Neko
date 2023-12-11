const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const guildMemberRemove = require('../../Events/guild_members/guildMemberRemove');
require('dotenv').config()

module.exports = {
    name: 'kick',
    category: 'moderation',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: false,
    usage: 'kick <@target> <raison>',
    examples: ['kick @.yumii spam', 'kick @.yumii flood'], 
    description: 'Kick un utilisateur du serveur',

    run: async (client, message, args, guildSettings, userSettings) => {

        const target = message.mentions.users.find(m => m.id);
        const targetMember = message.mentions.members.find(m => m.id);
        const raison = args.slice(1).join(' ');

        if (!target) return message.channel.send('Merci de mentionner un utilisateur à kick');
        if (!targetMember.kickable) return message.reply('Cet utilisateur ne peut pas être kick');
        if (!raison) return message.channel.send('Merci de spécifier une raison');

        try {
            await target.send({ content: `**Vous avez été kick du serveur ${message.guild.name}** \`\`\`Raison : ${raison}\n\`\`\``})
        } catch (err) {}

        targetMember.kick(raison);
        
        const raisonembed = {
            description: 
            `**Raison du kick :** ${raison}`,
        }

        message.channel.send({ content: `**${target} a été kick** *!*`, embeds: [ raisonembed ]});
        
        const logkickembed = {
            author: {
                name: `Kick | ${target.tag}`,
                icon_url: message.author.displayAvatarURL({ dynamic: true }),
            },
            fields : [
                {
                    name: '± Utilisateur kick :',
                    value: `${target} \n *(\`${target.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Kick par :',
                    value: `${message.author} \n *(\`${message.author.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Raison :',
                    value: `${raison}`,
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
                text: `L'utilisateur a été kick du serveur`,
                icon_url: target.displayAvatarURL({ dynamic: true }),
            },
        }

    },

    options: [
        {
            name: 'target',
            description: 'Utilisateur à kick',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'raison',
            description: 'Raison du kick',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const target = interaction.options.getUser('target');

        const targetMember = interaction.options.getMember('target');
        const raison = interaction.options.getString('raison');

        try {
            target.send({ content: `**Vous avez été kick du serveur ${interaction.guild.name}** \`\`\`Raison : ${raison}\n\`\`\``})
        } catch (err) {
            console.log({content : `Impossible d'envoyé un message à l'utilisateur`, err});
        }

        targetMember.kick(raison);

        if (!targetMember.kickable) return interaction.reply('Cet utilisateur ne peut pas être kick');
 
        const raisonembed = {
            description: 
            `**Raison du kick :** ${raison}`,
        }

        interaction.reply({ content: `**${target} a été kick** *!*`, embeds: [ raisonembed ]});
        
        const logkickembed = {
            author: {
                name: `Kick | ${target.tag}`,
                icon_url: interaction.user.displayAvatarURL({ dynamic: true }),
            },
            fields : [
                {
                    name: '± Utilisateur kick :',
                    value: `${target} \n *(\`${target.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Kick par :',
                    value: `${interaction.user} \n *(\`${interaction.user.id}\`)*`,
                    inline: true
                },
                {
                    name: '± Raison :',
                    value: `${raison}`,
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
                text: `L'utilisateur a été kick du serveur`,
                icon_url: target.displayAvatarURL({ dynamic: true }),
            },
        }

        const logChannel = client.channels.cache.get(process.env.LOG_ID);
        logChannel.send({ embeds: [ logkickembed ]});

    }

};