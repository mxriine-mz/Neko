const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');


module.exports = {
    name: 'prefix',
    category: 'administration',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: true,
    usage: 'prefix [value]',
    examples: [' '], 
    description: 'Configure la base de données',

    run: async (client, message, args, guildSettings, userSettings) => {
        
        const value = args[0];

            if (value) {
                await client.updateGuild(message.guild, { prefix: value });
                return message.reply({ content: `**${message.author.username}**, le préfixe a été sauvegardé avec succès, c'est maintenant : \`${value}\``});
            }

            message.reply({ content: `**${message.author.username}**, le préfixe actuel pour ce serveur est : \`${guildSettings.prefix}\``});

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
                await client.updateGuild(interaction.guild, { prefix: value });
                return interaction.reply({ content: `**${interaction.user.username}**, le préfixe a été sauvegardé avec succès, c'est maintenant : \`${value}\``});
            }
            interaction.reply({ content: `**${interaction.user.username}**, le préfixe actuel pour ce serveur est : \`${guildSettings.prefix}\``});
    },

};