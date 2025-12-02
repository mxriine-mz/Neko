const { ApplicationCommandOptionType, PermissionFlagsBits, MessageFlags } = require("discord.js");
const dayjs = require("dayjs");

// ——————————————————————————————
// TYPE DE MAILS / RÔLES (depuis .env)
// ——————————————————————————————
const ANNOUNCE_TYPES = {
  mail: process.env.MAIL_ROLE_ID,
  recrutement: process.env.RECRUIT_ROLE_ID,
  giveaways: process.env.GIVEAWAYS_ROLE_ID,
  partenship: process.env.PATERNSHIP_ROLE_ID,
  animation: process.env.ANIM_ROLE_ID,
  poll: process.env.POLL_ROLE_ID,
};

module.exports = {
  name: "announce",
  category: "info",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: false,
  usage: "annonce <type> <message>",
  examples: ["annonce global Coucou à tous", "annonce promo -40% aujourd’hui !"],
  description: "Envoie une annonce dans le salon configuré.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings) => {
    const type = args[0]?.toLowerCase();
    const content = args.slice(1).join(" ");

    if (!type || !content) {
      return message.reply("Usage : `annonce <type> <message>`");
    }

    if (!ANNOUNCE_TYPES[type]) {
      return message.reply(
        "Type invalide. Types possibles : " +
          Object.keys(ANNOUNCE_TYPES).join(", ")
      );
    }

    // Récupération du salon configuré dans la DB
    const announceChannelID = guildSettings?.announceChannel;
    if (!announceChannelID) {
      return message.reply(
        "Aucun salon configuré pour les annonces (`announceChannel` manquant en DB)."
      );
    }

    const announceChannel = client.channels.cache.get(announceChannelID);
    if (!announceChannel) {
      return message.reply("Salon d'annonce introuvable.");
    }

    const date = dayjs().format("DD/MM/YY");
    const roleId = ANNOUNCE_TYPES[type];
    const TYPE = type.toUpperCase();

    await announceChannel.send({
      content: `⸝⸝・₊ **${TYPE}** ! . . . \`${date}\` ・ ping <@&${roleId}> ;;\n${content}`
    });

    return message.reply("Votre annonce a été envoyée !");
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [
    {
      name: "type",
      description: "Quel type d'annonce voulez-vous envoyer ?",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: Object.keys(ANNOUNCE_TYPES).map((t) => ({
        name: t.toUpperCase(),
        value: t,
      })),
    },
    {
      name: "message",
      description: "Contenu de l'annonce",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  runInteraction: async (client, interaction, guildSettings) => {
    const type = interaction.options.getString("type");
    const content = interaction.options.getString("message");

    if (!ANNOUNCE_TYPES[type]) {
      return interaction.reply({
        content: "Type invalide.",
        flags: MessageFlags.Ephemeral,
      });
    }

    // Récupération du salon configuré dans la DB
    const announceChannelID = guildSettings?.announceChannel;
    if (!announceChannelID) {
      return interaction.reply({
        content: "Aucun salon configuré pour les annonces (`announceChannel` manquant en DB).",
        flags: MessageFlags.Ephemeral,
      });
    }

    const announceChannel = client.channels.cache.get(announceChannelID);
    if (!announceChannel) {
      return interaction.reply({
        content: "Salon d'annonce introuvable.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const date = dayjs().format("DD/MM/YY");
    const roleId = ANNOUNCE_TYPES[type];
    const TYPE = type.toUpperCase();

    await announceChannel.send({
      content: `⸝⸝・₊ **${TYPE}** ! . . . \`${date}\` ・ ping <@&${roleId}> ;;\n${content}`
    });

    return interaction.reply({
      content: "L'annonce a été envoyée !",
      flags: MessageFlags.Ephemeral,
    });
  },
};
