const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "logs",
  category: "administration",
  permissions: PermissionFlagsBits.ManageGuild,
  ownerOnly: true,
  usage: ["logs <true|false>", "logs channel <#salon>"],
  examples: ["logs true", "logs false", "logs channel #logs"],
  description: "Active/désactive les logs et configure le salon assigné.",

  // ————————————————————————————————————————
  // SLASH OPTIONS
  // ————————————————————————————————————————
  options: [
    {
      name: "action",
      description: "Choisir une action concernant les logs.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Activer les logs", value: "enable" },
        { name: "Désactiver les logs", value: "disable" },
        { name: "Configurer le salon", value: "channel" }
      ]
    },
    {
      name: "salon",
      description: "Salon où les logs seront envoyées.",
      type: ApplicationCommandOptionType.Channel,
      required: false
    }
  ],

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  async run(client, message, args, guildSettings) {
    const prefix = guildSettings.prefix;

    // — Aide si invalide —
    if (!args[0] || !/^(true|false|channel)$/i.test(args[0])) {
      const embed = new EmbedBuilder()
        .setColor("#f7c97f")
        .setTitle("Configuration des Logs")
        .setDescription(
          [
            "Cette commande permet d'activer/désactiver les logs,",
            "et de définir le salon assigné.",
            "",
            "**Utilisation :**",
            `\`${prefix}logs <true|false>\``,
            `\`${prefix}logs channel <#salon>\``
          ].join("\n")
        );

      return message.reply({ embeds: [embed] });
    }

    const action = args[0].toLowerCase();

    // Activer
    if (action === "true") {
      guildSettings.logs = true;
      await guildSettings.save();

      return message.reply({
        content: `Les logs ont été **activées**. Définissez un salon avec \`${prefix}logs channel <#salon>\`.`
      });
    }

    // Désactiver
    if (action === "false") {
      guildSettings.logs = false;
      await guildSettings.save();

      return message.reply({
        content: `Les logs ont été **désactivées**.`,
      });
    }

    // Configurer salon
    if (action === "channel") {
      const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]);

      if (!channel || channel.type !== 0) {
        return message.reply({
          content: `Le salon indiqué est invalide, oh. Merci de fournir un **salon textuel**.`
        });
      }

      guildSettings.logsChannel = channel.id;
      await guildSettings.save();

      return message.reply({
        content: `Le salon des logs est maintenant défini sur : <#${channel.id}>.`
      });
    }
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  async runInteraction(client, interaction, guildSettings) {
    const action = interaction.options.getString("action");
    const channel = interaction.options.getChannel("salon");

    // Activer
    if (action === "enable") {
      guildSettings.logs = true;
      await guildSettings.save();

      return interaction.reply({
        content: `Les logs sont maintenant **activées**. Configure un salon avec \`/logs action:channel salon:#salon\`.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    // Désactiver
    if (action === "disable") {
      guildSettings.logs = false;
      await guildSettings.save();

      return interaction.reply({
        content: `Les logs ont été **désactivées**.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    // Configuration du salon
    if (action === "channel") {
      if (!channel || channel.type !== 0) {
        return interaction.reply({
          content: `Ahh mon frère, il faut un **salon textuel** wa… pas un vocal oh !`,
          flags: MessageFlags.Ephemeral,
        });
      }

      guildSettings.logsChannel = channel.id;
      await guildSettings.save();

      return interaction.reply({
        content: `Le salon des logs est maintenant défini sur : <#${channel.id}>. Là c'est carré-carré !`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }
};
