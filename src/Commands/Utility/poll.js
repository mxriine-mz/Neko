const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "poll",
  category: "utility",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: false,
  usage: "poll <question>",
  examples: ["poll Est-ce que ce bot est cool ?"],
  description: "Créer un sondage simple avec réactions.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args) => {
    if (!args.length) {
      return message.reply(
        "Merci d'entrer une question pour votre sondage *!*"
      );
    }

    const question = args.join(" ");

    const embed = new EmbedBuilder()
      .setColor(0x202225)
      .setTitle("📊 Sondage")
      .setDescription(question)
      .setTimestamp()
      .setFooter({
        text: `Par ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    // Envoi de l'embed
    const pollMessage = await message.channel.send({ embeds: [embed] });

    // Ajout des réactions
    try {
      await pollMessage.react("✅");
      await pollMessage.react("❌");
    } catch (err) {
      console.error("Erreur lors de l'ajout des réactions :", err);
    }
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [
    {
      name: "title",
      description: "Titre du sondage",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "content",
      description: "Contenu / question du sondage",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  runInteraction: async (client, interaction) => {
    const title = interaction.options.getString("title");
    const content = interaction.options.getString("content");

    const embed = new EmbedBuilder()
      .setColor(0x202225)
      .setTitle(`📊 ${title}`)
      .setDescription(content)
      .setTimestamp()
      .setFooter({
        text: `Par ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    // Envoi (fetchReply pour récupérer le message)
    const pollMessage = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });

    // Ajout réactions
    try {
      await pollMessage.react("✅");
      await pollMessage.react("❌");
    } catch (err) {
      console.error("Erreur lors des réactions :", err);
    }
  },
};
