const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');


module.exports = {
    name: 'reload',
    category: 'administration',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: true,
    usage: 'reload',
    examples: ['reload'], 
    description: 'Reload le bot',

    run: async (client, message, args, guildSettings, userSettings) => {
        // const devGuild = await client.guilds.cache.get(process.env.GUILD_ID);
        // devGuild.commands.set([]);
        await message.reply('Le bot est en cours de rechargement');
        process.exit();

    },

    runInteraction: async (client, interaction, guildSettings, userSettings) => {
        // const devGuild = await client.guilds.cache.get(process.env.GUILD_ID);
        // devGuild.commands.set([]);
        await interaction.reply('Le bot est en cours de rechargement');
        process.exit();
    }

};