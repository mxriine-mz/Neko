const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');


module.exports = {
    name: 'emit',
    category: 'administration',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: true,
    usage: 'emit <event>',
    examples: ['emit guildMemberAdd', 'emit guildMemberRemove', 'emit guildCreate'], 
    description: 'Emet un évènement',

    run: async (client, message, args, guildSettings, userSettings) => {
        
        if (!args[0] || !args[0].match(/^(guildMemberAdd|guildMemberRemove)$/)) 
        return message.reply('Merci d\'entrer un évènement valide (\`guildMemberAdd\`/\`guildMemberRemove\`)');
        
        if (args[0] == 'guildMemberAdd') {
            client.emit('guildMemberAdd', message.member);
            message.reply('Évènement --guildMemberAdd-- émis !');
        } else if (args[0] == 'guildCreate'){
            client.emit('guildCreate', message.guild);
            message.reply('Évènement --guildCreate-- émis !');
        } else {
            client.emit('guildMemberRemove', message.member);
            message.reply('Évènement --guildMemberRemove-- émis !');
        }

    },
    options: [
        {
            name: 'event',
            description: 'Choisir un évènement à émettre',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'guildMemberAdd',
                    value: 'guildMemberAdd',
                },
                {
                    name: 'guildMemberRemove',
                    value: 'guildMemberRemove',
                },
                {
                    name: 'guildCreate',
                    value: 'guildCreate',
                },
            ],
        }
    ],

    runInteraction: (client, interaction) => {
        const evtChoices = interaction.options.getString('event');

        if (evtChoices == 'guildMemberAdd') {
            client.emit('guildMemberAdd', interaction.member);
            interaction.reply({ content: 'Évènement --guildMemberAdd-- émis !', ephemeral: true });
        } else if (evtChoices == 'guildCreate'){
            client.emit('guildCreate', interaction.guild);
            interaction.reply({ content: 'Évènement --guildCreate-- émis !', ephemeral: true});
        } else {
            client.emit('guildMemberRemove', interaction.member);
            interaction.reply({ content: 'Évènement --guildMemberRemove-- émis !', ephemeral: true });
        }
    },

};