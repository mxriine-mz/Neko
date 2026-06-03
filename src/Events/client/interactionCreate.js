const { InteractionType, MessageFlags } = require("discord.js");
const Logger = require("../../Loaders/Logger");

module.exports = {
  name: "interactionCreate",
  once: false,

  async execute(client, interaction) {
    // Interactions hors serveur
    if (!interaction.guild) {
      return interaction.reply({
        content: "Cette interaction ne fonctionne qu'en serveur.",
        flags: MessageFlags.Ephemeral
      }).catch(() => {});
    }

    // Settings DB
    let guildSettings = await client.getGuild(interaction.guild.id, interaction.guild.name);
    let userSettings = await client.getUser(interaction.user.id, interaction.user.tag, interaction.guild.id);

    // AUTOCOMPLETE
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return interaction.respond([]);

      if (typeof cmd.autocompleteRun === "function") {
        return cmd.autocompleteRun(interaction);
      }
      return interaction.respond([]);
    }

    // SLASH COMMANDS
    if (interaction.isChatInputCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) {
        return interaction.reply({
          content: "Cette commande n'existe pas !",
          flags: MessageFlags.Ephemeral
        });
      }

      // Owner only
      if (cmd.ownerOnly && interaction.user.id !== process.env.OWNER_ID) {
        return interaction.reply({
          content: "Seul le propriétaire du bot peut utiliser cette commande.",
          flags: MessageFlags.Ephemeral
        });
      }

      // Permissions
      if (cmd.permissions && !interaction.member.permissions.has(cmd.permissions)) {
        return interaction.reply({
          content: "Vous n'avez pas les permissions nécessaires.",
          flags: MessageFlags.Ephemeral
        });
      }

      try {
        if (typeof cmd.runSlash === "function") {
          await cmd.runSlash(client, interaction);
        } else if (typeof cmd.execute === "function") {
          await cmd.execute(client, interaction);
        }
      } catch (error) {
        Logger.error(`Erreur dans la commande ${cmd.name}: ${error.message}`);
        console.error(error);
        
        const errorMsg = { content: "Une erreur s'est produite.", flags: MessageFlags.Ephemeral };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMsg).catch(() => {});
        } else {
          await interaction.reply(errorMsg).catch(() => {});
        }
      }
    }

    // BUTTONS
    if (interaction.isButton()) {
      // Extraire le nom du bouton : essaie "name:args" puis "name_args"
      let buttonName = interaction.customId.split(':')[0];
      let button = client.buttons.get(buttonName);
      if (!button) {
        buttonName = interaction.customId.split('_')[0];
        button = client.buttons.get(buttonName);
      }
      if (button && typeof button.execute === "function") {
        try {
          await button.execute(client, interaction);
        } catch (error) {
          Logger.error(`Erreur dans le bouton ${interaction.customId}: ${error.message}`);
          console.error(error);
        }
      }
    }

    // SELECT MENUS
    if (interaction.isStringSelectMenu()) {
      const select = client.selects.get(interaction.customId);
      if (select && typeof select.execute === "function") {
        try {
          await select.execute(client, interaction);
        } catch (error) {
          Logger.error(`Erreur dans le menu ${interaction.customId}: ${error.message}`);
          console.error(error);
        }
      }
    }
  }
};
