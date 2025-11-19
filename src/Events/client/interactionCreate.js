const { InteractionType, MessageFlags } = require("discord.js");
require("dotenv").config();

module.exports = {
  name: "interactionCreate",
  once: false,

  async execute(client, interaction) {
    // ———————————————————————————————
    // Chargement des settings DB
    // ———————————————————————————————
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

    // ———————————————————————————————
    // 1 — AUTOCOMPLETE
    // ———————————————————————————————
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return;

      if (typeof cmd.autocompleteRun === "function") {
        return cmd.autocompleteRun(interaction);
      } else {
        return interaction.respond([]); // pas crash
      }
    }

    // ———————————————————————————————
    // 2 — SLASH COMMANDS + USER CONTEXT
    // ———————————————————————————————
    if (interaction.isChatInputCommand() || interaction.isUserContextMenuCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return interaction.reply(`Cette commande n'existe pas !`);

      // OWNER ONLY
      if (cmd.ownerOnly && interaction.user.id !== process.env.OWNER_ID) {
        return interaction.reply({
          content: `Seul le propriétaire du bot peut utiliser cette commande.`,
          flags: MessageFlags.Ephemeral
        });
      }

      // PERMISSIONS (si définies dans la commande)
      if (cmd.permissions) {
        if (!interaction.member.permissions.has(cmd.permissions)) {
          return interaction.reply({
            content: `Permissions manquantes : \`${Object.keys(cmd.permissions).join(", ")}\``,
            flags: MessageFlags.Ephemeral
          });
        }
      }

      // Exécution SLASH
      if (typeof cmd.runSlash === "function") {
        return cmd.runSlash(client, interaction, guildSettings, userSettings);
      }

      // Backward compatibility (ancien runInteraction)
      if (typeof cmd.runInteraction === "function") {
        return cmd.runInteraction(client, interaction, guildSettings, userSettings);
      }

      return interaction.reply({
        content: "Cette commande est mal configurée.",
        flags: MessageFlags.Ephemeral
      });
    }

    // ———————————————————————————————
    // 3 — BUTTONS
    // ———————————————————————————————
    if (interaction.isButton()) {
      const btn = client.buttons.get(interaction.customId);
      if (!btn) return interaction.reply(`Ce bouton n'existe pas !`);

      return btn.runInteraction(client, interaction, guildSettings, userSettings);
    }

    // ———————————————————————————————
    // 4 — SELECT MENUS
    // ———————————————————————————————
    if (interaction.isStringSelectMenu()) {
      const selectMenu = client.selects.get(interaction.customId);
      if (!selectMenu) return interaction.reply(`Ce menu n'existe pas !`);

      return selectMenu.runInteraction(client, interaction, guildSettings, userSettings);
    }
  },
};
