const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const dayjs = require("dayjs");

module.exports = {
  name: "mail",
  category: "info",
  permissions: PermissionFlagsBits.KickMembers, // tu veux ça, je garde
  ownerOnly: false,
  usage: "mail <ping> <message>",
  examples: ["mail everyone Coucou à tous", "mail here Maintenance !"],
  description: "Envoie un mail d'annonce dans le salon configuré.",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    const ping = args[0];
    const content = args.slice(1).join(" ");

    if (!ping || !content) {
      return message.reply("Usage : `mail <ping> <message>`");
    }

    // Récupération du salon
    const mailChannel =
      client.channels.cache.get(process.env.MAIL_SALON_ID) || null;

    if (!mailChannel) {
      return message.reply(
        "❌ Impossible de trouver le salon de mail (`MAIL_SALON_ID`)."
      );
    }

    // Envoi du message
    const date = dayjs().format("DD/MM/YY");

    await mailChannel.send({
      content:
        `**MAIL** ! . . . \`${date}\` ・ ping ${ping} ;\n` +
        content,
    });

    return message.reply("Le mail a été envoyé.");
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [
    {
      name: "content",
      description: "Contenu du mail",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async runInteraction(client, interaction) {
    const content = interaction.options.getString("content");

    const date = dayjs().format("DD/MM/YY");

    // Récupération du salon ou mention rôle
    const rolePing = process.env.MAIL_MEMBER_ID;
    if (!rolePing) {
      return interaction.reply({
        content: "❌ MAIL_MEMBER_ID n'est pas configuré dans le .env",
        ephemeral: true,
      });
    }

    return interaction.reply({
      content:
        `⸝⸝・₊ **MAIL** ! . . . \`${date}\` ・ ping <@&${rolePing}> ;;\n` +
        content,
    });
  },
};
