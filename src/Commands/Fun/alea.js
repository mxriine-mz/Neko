const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "alea",
  category: "fun",
  permissions: PermissionFlagsBits.KickMembers, // tu veux ça, je garde
  ownerOnly: false,
  usage: "alea <choix1> <choix2> ...",
  examples: ["alea option1 option2"],
  description: "Choisit un élément aléatoire parmi vos propositions",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args) => {
    if (args.length < 2) {
      return message.reply(
        "Vous devez saisir **au moins deux arguments différents** *!*"
      );
    }

    // Filtrer les valeurs non définies / vides
    const options = args.filter((x) => !!x).slice(0, 10);

    // Empêcher deux arguments identiques obligatoires
    if (options[0] === options[1]) {
      return message.reply(
        "Vous devez saisir **au moins deux arguments différents** *!*"
      );
    }

    // Choix aléatoire
    const choice = options[Math.floor(Math.random() * options.length)];

    return message.channel.send(`> Le choix aléatoire est : \`${choice}\`!`);
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: Array.from({ length: 10 }).map((_, i) => ({
    name: `option${i + 1}`,
    description: "Proposition à choisir au hasard",
    type: ApplicationCommandOptionType.String,
    required: i < 2, // option1 et option2 obligatoires
  })),

  runInteraction: async (client, interaction) => {
    // On récupère uniquement les options non nulles
    const options = [];
    for (let i = 1; i <= 10; i++) {
      const value = interaction.options.getString(`option${i}`);
      if (value) options.push(value);
    }

    if (options.length < 2) {
      return interaction.reply({
        content: "Vous devez saisir **au moins deux arguments**.",
        ephemeral: true,
      });
    }

    if (options[0] === options[1]) {
      return interaction.reply({
        content: "Les deux premiers arguments doivent être **différents**.",
        ephemeral: true,
      });
    }

    const choice = options[Math.floor(Math.random() * options.length)];

    return interaction.reply(`> Le choix aléatoire est : \`${choice}\`!`);
  },
};
