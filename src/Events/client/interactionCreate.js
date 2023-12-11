const { InteractionType } = require('discord.js');
require('dotenv').config()

module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute(client, interaction) {

        let guildSettings = await client.getGuild(interaction.guild);

        if (!guildSettings) {
            await client.createGuild(interaction.guild);
            guildSettings = await client.getGuild(interaction.guild);
        }

        let userSettings = await client.getUser(interaction.user);

        if (!userSettings) {
            await client.createUser(interaction.user);
            userSettings = await client.getUser(interaction.user);
        }

        if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return interaction.reply(`Cette commande n'existe pas !`);
            
            if (cmd.type !== InteractionType.ApplicationCommandAutocomplete) return interaction.reply(`Cette commande n'est pas un autocomplete !`);

            cmd.runInteraction(client, interaction, guildSettings, userSettings);
        }
        
        if (interaction.type === InteractionType.ApplicationCommand || interaction.isUserContextMenuCommand()) {

            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return interaction.reply(`Cette commande n'existe pas !`);

            if (cmd.ownerOnly) {
                if (interaction.user.id !== process.env.OWNER_ID) return interaction.reply(`Seul le propriétaire du bot peut taper cette commande!`);
            }    

            if (!interaction.member.permissions.has([cmd.permissions])) return interaction.reply(`Vous n'avez pas la/les permissions(s) requise(s) (\`${Object.keys(cmd.permissions).join(', ')}\`) pour taper cette commande!`);

            cmd.runInteraction(client, interaction, guildSettings, userSettings);

        } else if (interaction.isButton()) {

            const btn = client.buttons.get(interaction.customId);
            if (!btn) return interaction.reply(`Ce bouton n'existe pas !`);

            btn.runInteraction(client, interaction, guildSettings, userSettings);
    
        } else if (interaction.isStringSelectMenu()) {

            const selectMenu = client.selects.get(interaction.customId);
            if (!selectMenu) return interaction.reply(`Ce menu n'existe pas !`);

            selectMenu.runInteraction(client, interaction, guildSettings, userSettings);
        }
    },
};