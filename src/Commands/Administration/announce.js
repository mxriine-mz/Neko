const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');


module.exports = {
    name: 'announce',
    category: 'administration',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: true,
    usage: ['announce [true|false]', 'announce [channel] <channel>'],
    examples: ['announce true', 'announce channel #channel'], 
    description: 'Active et configure le channel d\'annonce du serveur (join/leave).',

    run: async (client, message, args, guildSettings, userSettings) => {
        
        if (!args[0] || !args[0].match(/^(true|false|channel)$/)) 
        return message.reply({ embeds : [ embed = {
            author : {
                name: `Neko`,
                icon_url: client.user.displayAvatarURL({ dynamic: true }),
            },
            title: `Visualisation de la commande Announce`,
            description: `>>> Active/désactive les annonces avec \`true\` ou  \`false\` *(Par default les announces sont désactivé)* \n Configure le channel d\'annonce avec \`channel \` et le nom du channel.`,
            fields: [
                {
                    name: 'Utilisation',
                    value: `\`${client.commands.filter(cmd => cmd.name == 'announce').map(cmd => `${(cmd.usage).join('\n')}`)}\``,
                },
                {
                    name: 'Exemples',
                    value:  `\`\`\`${client.commands.filter(cmd => cmd.name == 'announce').map(cmd => `${(cmd.examples).join(' | ')}`)}\`\`\``,
                },
            ],
        }]});

        if (args[0] == 'true') {
            
            guildSettings.announce = true;
            guildSettings.save();

            return message.reply({ content : `**${message.author.username}**, les annonces ont été activées avec succès. Merci de définir le channel d'annonce avec la commande \`announce channel\``});
        
        } else if (args[0] == 'false') {

            guildSettings.announce = false;
            guildSettings.save();

            return message.reply({ content : `**${message.author.username}**, les annonces ont été désactivées avec succès.`});
        
        } else if (args[0] == 'channel') {

            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if (!channel) return message.reply({ content : `**${message.author.username}**, merci de mentionner un channel valide.`});

            guildSettings.announceChannel = channel.id;
            guildSettings.save();

            return message.reply({ content : `**${message.author.username}**, le channel d'annonce a été configuré avec succès. C'est maintenant : <#${channel.id}> \n Tu peux maintenant configurer le message d'annonce avec la commande \`announce message\``});
        
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
            
    
        },

};