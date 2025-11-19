const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "emit",
  category: "administration",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: true,
  usage: "emit <event>",
  examples: ["emit guildMemberAdd", "emit guildMemberRemove", "emit guildCreate"],
  description: "Émet un évènement Discord pour tester les systèmes du serveur.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    const event = args[0];

    // Validation
    if (!event || !/^(guildMemberAdd|guildMemberRemove|guildCreate)$/i.test(event)) {
      return message.reply(
        "Merci d'entrer un évènement valide (`guildMemberAdd`, `guildMemberRemove`, `guildCreate`)."
      );
    }

    // Exécution des évènements
    if (event === "guildMemberAdd") {
      client.emit("guildMemberAdd", message.member);
      return message.reply("Évènement **guildMemberAdd** émis !");
    }

    if (event === "guildCreate") {
      client.emit("guildCreate", message.guild);
      return message.reply("Évènement **guildCreate** émis !");
    }

    if (event === "guildMemberRemove") {
      client.emit("guildMemberRemove", message.member);
      return message.reply("Évènement **guildMemberRemove** émis !");
    }
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [
    {
      name: "event",
      description: "Choisir un évènement à émettre",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "guildMemberAdd", value: "guildMemberAdd" },
        { name: "guildMemberRemove", value: "guildMemberRemove" },
        { name: "guildCreate", value: "guildCreate" },
      ],
    },
  ],

  runInteraction: (client, interaction) => {
    const event = interaction.options.getString("event");

    if (event === "guildMemberAdd") {
      client.emit("guildMemberAdd", interaction.member);
      return interaction.reply({
        content: "Évènement **guildMemberAdd** émis !",
        ephemeral: true,
      });
    }

    if (event === "guildCreate") {
      client.emit("guildCreate", interaction.guild);
      return interaction.reply({
        content: "Évènement **guildCreate** émis !",
        ephemeral: true,
      });
    }

    if (event === "guildMemberRemove") {
      client.emit("guildMemberRemove", interaction.member);
      return interaction.reply({
        content: "Évènement **guildMemberRemove** émis !",
        ephemeral: true,
      });
    }
  },
};
