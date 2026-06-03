const { 
  ApplicationCommandOptionType, 
  PermissionFlagsBits, 
  SlashCommandBuilder 
} = require("discord.js");

module.exports = {
  name: "prefix",
  category: "administration",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: true,
  usage: "prefix [value]",
  examples: ["prefix !", "prefix ?", "prefix neko!"],
  description: "Afficher ou modifier le préfixe du serveur",

  data: new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("Afficher ou modifier le préfixe du serveur")
    .addStringOption(option =>
      option.setName("value")
        .setDescription("Nouveau préfixe à assigner")
        .setRequired(false)
    ),

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (message, client, args) => {
    const value = args[0];
    const guildSettings = await client.getGuild(message.guild.id, message.guild.name);

    if (value) {
      await client.updateGuild(guildSettings.id, { prefix: value });

      return message.reply({
        content: `**${message.author.username}**, le préfixe a été mis à jour avec succès.\nNouveau préfixe : \`${value}\``,
      });
    }

    return message.reply({
      content: `**${message.author.username}**, le préfixe actuel de ce serveur est : \`${guildSettings.prefix}\``,
    });
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  runSlash: async (client, interaction) => {
    const value = interaction.options.getString("value");
    const guildSettings = await client.getGuild(interaction.guild.id, interaction.guild.name);

    if (value) {
      await client.updateGuild(guildSettings.id, { prefix: value });

      return interaction.reply({
        content: `**${interaction.user.username}**, le préfixe a été mis à jour avec succès.\nNouveau préfixe : \`${value}\``,
      });
    }

    return interaction.reply({
      content: `**${interaction.user.username}**, le préfixe actuel de ce serveur est : \`${guildSettings.prefix}\``,
    });
  },
};
