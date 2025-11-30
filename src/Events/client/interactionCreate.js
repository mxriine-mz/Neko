const { InteractionType, MessageFlags } = require("discord.js");
require("dotenv").config();

module.exports = {
  name: "interactionCreate",
  once: false,

  // ATTENTION : ORDRE DES ARGUMENTS !!!
  async execute(interaction, client) {

    // 0 — INTERACTIONS HORS SERVEUR
    if (!interaction.guild) {
      return interaction.reply({
        content: "Cette interaction ne fonctionne qu'en serveur.",
        flags: MessageFlags.Ephemeral
      }).catch(() => { });
    }

    // 1 — SETTINGS DB
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

    // 2 — AUTOCOMPLETE
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return interaction.respond([]);

      if (typeof cmd.autocompleteRun === "function") {
        return cmd.autocompleteRun(interaction);
      }
      return interaction.respond([]);
    }

    // 3 — SLASH COMMANDS & CONTEXT MENUS
    if (interaction.isChatInputCommand() || interaction.isUserContextMenuCommand()) {
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
          content: `Permissions manquantes : \`${cmd.permissions.toString()}\``,
          flags: MessageFlags.Ephemeral
        });
      }

      // Nouvelle méthode prioritaire
      if (typeof cmd.runSlash === "function") {
        return cmd.runSlash(client, interaction, guildSettings, userSettings)
          .catch(err => {
            console.error(err);
            interaction.reply({
              content: "Erreur lors de l'exécution de la commande.",
              flags: MessageFlags.Ephemeral
            });
          });
      }

      // Ancienne méthode runInteraction
      if (typeof cmd.runInteraction === "function") {
        return cmd.runInteraction(client, interaction, guildSettings, userSettings)
          .catch(err => {
            console.error(err);
            interaction.reply({
              content: "Erreur lors de l'exécution de la commande.",
              flags: MessageFlags.Ephemeral
            });
          });
      }

      return interaction.reply({
        content: "Cette commande est mal configurée.",
        flags: MessageFlags.Ephemeral
      });
    }

    // 4 — BUTTONS
    if (interaction.isButton()) {

      const rawId = interaction.customId;
      const baseId = rawId.split(":")[0];

      const btn = client.buttons.get(baseId);
      if (!btn) {
        return interaction.reply({
          content: "Ce bouton n'existe pas !",
          ephemeral: true
        });
      }

      try {
        return btn.runInteraction(client, interaction, guildSettings, userSettings);
      } catch (err) {
        console.error(err);
        return interaction.reply({
          content: "Erreur dans ce bouton.",
          ephemeral: true
        });
      }
    }


    // 5 — SELECT MENUS
    if (interaction.isStringSelectMenu()) {
      const menu = client.selects.get(interaction.customId);
      if (!menu) {
        return interaction.reply({
          content: "Ce menu n'existe pas !",
          flags: MessageFlags.Ephemeral
        });
      }

      try {
        return menu.runInteraction(client, interaction, guildSettings, userSettings);
      } catch (err) {
        console.error(err);
        return interaction.reply({
          content: "Erreur dans ce menu.",
          flags: MessageFlags.Ephemeral
        });
      }
    }
  },
};
