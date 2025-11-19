const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

// Récupère automatiquement toutes les actions depuis les fichiers .json
function getActions() {
  const dir = path.join(__dirname, "../../Assets/Gif_.Anime");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  return files.map(f => f.replace(".json", "")); // baka.json → baka
}

module.exports = {
  name: "anime",
  description: "Envoie une interaction animée",
  category: "fun",

  // Le builder DJS utilisé plus tard dans runInteraction
  slashData: new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Envoie une interaction animée")
    .addStringOption(option =>
      option
        .setName("action")
        .setDescription("Type d'action")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Utilisateur cible")
        .setRequired(true)
    ),

  // ————————————————————————————————
  // AUTOCOMPLETE HANDLER
  // ————————————————————————————————
  async autocompleteRun(interaction) {
    const focused = interaction.options.getFocused();
    const actions = getActions();

    const filtered = actions.filter(a =>
      a.toLowerCase().startsWith(focused.toLowerCase())
    );

    await interaction.respond(
      filtered.slice(0, 25).map(a => ({
        name: a,
        value: a,
      }))
    );
  },

  // ————————————————————————————————
  // SLASH VERSION (LE BON NOM)
  // ————————————————————————————————
  async runInteraction(client, interaction) {
    const action = interaction.options.getString("action");
    const user = interaction.options.getUser("user");

    this.sendAnime(interaction, interaction.user, user, action);
  },

  // ————————————————————————————————
  // PREFIX VERSION (LE BON NOM)
  // ————————————————————————————————
  async run(client, message, args) {
    const action = args[0];
    const user = message.mentions.users.first();

    if (!action || !user) {
      return message.reply(`Usage correct : !anime <action> <@user>`);
    }

    this.sendAnime(message, message.author, user, action);
  },

  // ————————————————————————————————
  // LOGIQUE COMMUNE
  // ————————————————————————————————
  sendAnime(ctx, sender, target, action) {
    const filePath = path.join(
      __dirname,
      "../../Assets/Gif_.Anime",
      `${action}.json`
    );

    if (!fs.existsSync(filePath)) {
      return ctx.reply({
        content: "Cette action n'existe pas.",
        ephemeral: true,
      });
    }

    const gifs = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const gif = gifs[Math.floor(Math.random() * gifs.length)];

    const embed = new EmbedBuilder()
      .setColor("#FF6AD5")
      .setDescription(`**${sender} → ${target}**`)
      .setImage(gif);

    if (ctx.reply) return ctx.reply({ embeds: [embed] });
    else return ctx.channel.send({ embeds: [embed] });
  },
};
