const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');


module.exports = {
    name: 'logs',
    category: 'administration',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: true,
    usage: ['logs [true|false]', 'logs [channel] <channel>'],
    examples: ['logs true', 'logs channel #channel'], 
    description: 'Configure la base de données',

    run: async (client, message, args, guildSettings, userSettings) => {

        if (!args[0] || !args[0].match(/^(true|false|channel)$/)) 
        return message.reply({ embeds : [ embed = {
            author : {
                name: `Neko`,
                icon_url: client.user.displayAvatarURL({ dynamic: true }),
            },
            title: `Visualisation de la commande Announce`,
            description: `>>> Active/désactive les logs avec \`true\` ou  \`false\` *(Par default les logs sont désactivé)* \n Configure le channel des logs avec \`channel \` et le nom du channel.`,
            fields: [
                {
                    name: 'Utilisation',
                    value: `\`${client.commands.filter(cmd => cmd.name == 'logs').map(cmd => `${(cmd.usage).join('\n')}`)}\``,
                },
                {
                    name: 'Exemples',
                    value:  `\`\`\`${client.commands.filter(cmd => cmd.name == 'logs').map(cmd => `${(cmd.examples).join(' | ')}`)}\`\`\``,
                },
            ],
        }]});

        if (args[0] == 'true') {

            guildSettings.logs = true;
            guildSettings.save();

            return message.reply({ content : `**${message.author.username}**, les logs ont été activées avec succès. Merci de définir le channel des logs avec la commande \`logs channel\``});
        
        } else if (args[0] == 'false') {

            guildSettings.logs = false;
            guildSettings.save();

            return message.reply({ content : `**${message.author.username}**, les logs ont été désactivées avec succès.`});
        
        } else if (args[0] == 'channel') {

            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if (!channel) return message.reply({ content : `**${message.author.username}**, merci de mentionner un channel valide.`});

            guildSettings.logsChannel = channel.id;
            guildSettings.save();

            return message.reply({ content : `**${message.author.username}**, le channel des logs a été configuré avec succès. C'est maintenant : <#${channel.id}>`});
        }
    },

    options: [
        {
            name: 'value',
            description: 'Choisir une valeur à attribuer à la clé',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    async runInteraction(client, interaction, guildSettings) {
        const value = interaction.options.getString('value');

            if (value) {
                await client.updateGuild(interaction.guild, { logChannel: value });
                return interaction.reply({ content: `**${interaction.user.username}**, le salon de log a été sauvegardé avec succès, c'est maintenant : <#${value}>`});
            }

            interaction.reply({ content: `**${interaction.user.username}**, le salon de log actuel pour ce serveur est : <#${guildSettings.logChannel}>`});

    },

};