const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags
} = require("discord.js");

const fs = require("fs");
const path = require("path");

// ————————————————————————————————————————
// UTILITAIRE : charger les actions (autocomplete)
// ————————————————————————————————————————
function getActions() {
  const dir = path.join(__dirname, "../../Assets/Gif_.Anime");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((f) => f.replace(".json", ""));
}

module.exports = {
  name: "anime",
  category: "fun",
  permissions: PermissionFlagsBits.SendMessages,
  ownerOnly: false,
  usage: "anime <action> [@user]",
  examples: ["anime slap @Machin", "anime hug"],
  description: "Envoie une interaction animée",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args) => {
    const action = args[0];
    const user = message.mentions.users.first() || null;

    if (!action) {
      return message.reply("Usage correct : !anime <action> [@user]");
    }

    module.exports.sendAnime(message, message.author, user, action);
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [
    {
      name: "action",
      description: "Type d'action animée",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: "user",
      description: "Utilisateur cible",
      type: ApplicationCommandOptionType.User,
      required: false, // user optionnel
    },
  ],

  runInteraction: async (client, interaction) => {
    const action = interaction.options.getString("action");
    const user = interaction.options.getUser("user") || null;

    module.exports.sendAnime(interaction, interaction.user, user, action);
  },

  // ————————————————————————————————————————
  // AUTOCOMPLETE
  // ————————————————————————————————————————
  autocompleteRun: async (interaction) => {
    const focused = interaction.options.getFocused();
    const actions = getActions();

    const filtered = actions.filter((a) =>
      a.toLowerCase().startsWith(focused.toLowerCase())
    );

    await interaction.respond(
      filtered.slice(0, 25).map((a) => ({
        name: a,
        value: a,
      }))
    );
  },

  // ————————————————————————————————————————
  // LOGIQUE CENTRALE
  // ————————————————————————————————————————
  sendAnime: async (ctx, sender, target, action) => {

    // Vérifier nom propre
    if (!/^[a-z0-9_-]+$/i.test(action)) {
      return ctx.reply({
        content: "Action invalide oh.",
        flags: MessageFlags.Ephemeral
      });
    }

    const base = path.join(__dirname, "../../Assets/Gif_.Anime");
    const filePath = path.join(base, `${action}.json`);

    if (!fs.existsSync(filePath)) {
      return ctx.reply({
        content: "Cette action n'existe pas, seigneuw Jésus.",
        flags: MessageFlags.Ephemeral
      });
    }

    let gifs;
    try {
      gifs = JSON.parse(await fs.promises.readFile(filePath, "utf8"));
    } catch (err) {
      return ctx.reply({
        content: "Fichier corrompu… tchuuuiiip.",
        flags: MessageFlags.Ephemeral
      });
    }

    if (!Array.isArray(gifs) || gifs.length === 0) {
      return ctx.reply({
        content: "Aucun gif pour cette action-là… ahh vwément.",
        flags: MessageFlags.Ephemeral
      });
    }

    const gif = gifs[Math.floor(Math.random() * gifs.length)];

    // ——————————————————————————
    // RÉCUPÉRATION DU DISPLAY NAME
    // ——————————————————————————
    const guildMember =
      ctx.member || // interactions
      (ctx.guild ? ctx.guild.members.cache.get(sender.id) : null); // prefix

    const senderDisplay =
      guildMember?.displayName || // pseudo serveur (ZelPhy)
      sender.globalName ||        // nom global
      sender.username;            // fallback

    const senderFormatted = `**${senderDisplay}**`;
    const targetFormatted = target ? `${target}` : ""; // mention si user

    const description = `${senderFormatted} ${action} ${targetFormatted}`.trim();

    const embed = new EmbedBuilder()
      .setColor("#202225")
      .setDescription(description)
      .setImage(gif);

    const isInteraction =
      typeof ctx.isChatInputCommand === "function" ||
      typeof ctx.deferReply === "function";

    return isInteraction
      ? ctx.reply({ embeds: [embed] })
      : ctx.channel.send({ embeds: [embed] });
  },
};
