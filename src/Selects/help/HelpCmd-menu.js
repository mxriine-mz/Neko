module.exports = {
    name: 'helpcmd-menu',

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const selectedOption = interaction.values[0];

        const newEmbed = {
            author : {
                name: `Neko`,
                icon_url: client.user.displayAvatarURL({ dynamic: true }),
            },
            title: `Visualisation de la commande ${selectedOption}`,
            description: `${client.commands.filter(cmd => cmd.name == selectedOption.toLowerCase()).map(cmd => `\`&${cmd.name}\` - ${cmd.description}`).join('\n')}`,
            fields: [
                {
                    name: 'Utilisation',
                    value: `\`\`\`&${client.commands.filter(cmd => cmd.name == selectedOption.toLowerCase()).map(cmd => `${cmd.usage}`).join('\n')}\`\`\``,
                },
                {
                    name: 'Exemples',
                    value: `\`\`\`&${client.commands.filter(cmd => cmd.name == selectedOption.toLowerCase()).map(cmd => `${cmd.examples}`).join('\n')}\`\`\``,
                },
            ],
        }
        
        interaction.update({embeds: [newEmbed]});
    }
}