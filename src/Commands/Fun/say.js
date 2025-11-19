const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "say",
  category: "fun",
  permissions: PermissionFlagsBits.KickMembers, // tu veux ça → je garde
  ownerOnly: false,
  usage: "say <message>",
  examples: ["say Hello World!"],
  description: "Répète le message envoyé",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args) => {
    if (!args.length) {
      return message.reply(
        "Vous devez préciser un message à répéter *!*"
      );
    }

    // Au lieu d'un slice() fragile → join()
    const content = args.join(" ");

    return message.channel.send(content);
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [
    {
      name: "message",
      description: "Le message à répéter",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  runInteraction: async (client, interaction) => {
    const content = interaction.options.getString("message");

    return interaction.reply(content);
  },
};
