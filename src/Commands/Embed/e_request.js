const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "e_request",
  category: "embed",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: true,
  usage: "e_request",
  examples: ["e_request"],
  description: "Envoie un embed pour les demandes de recrutement",

  run: async (client, message) => {
    const imageURL =
      "https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png";

    // ————————————————————————————————————————
    // Embed 1 — POSTULER
    // ————————————————————————————————————————
    const postuleEmbed = new EmbedBuilder()
      .setColor("#202225")
      .setTitle("・**POSTULER** ")
      .setDescription(
        `・Vous souhaitez rejoindre notre équipe ? pas de problème,\n` +
          ` voici quelques informations !\n` +
          ` l__**i**r__e et **p**__ostuler__﹒\n\n` +
          `・Si vous avez des questions, veuillez ouvrir un ticket en allant dans <#1440676993040384204>`
      )
      .setImage(imageURL)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    // ————————————————————————————————————————
    // Embed 2 — LES RÈGLES
    // ————————————————————————————————————————
    const rulesEmbed = new EmbedBuilder()
      .setColor("#202225")
      .setTitle("・LES RÈGLES")
      .setDescription(
        `>>> Travailler dans un environnement à la fois professionnel et convivial.\n` +
          `Bénéficier d'avantages et de contenus exclusifs pour le personnel.\n` +
          `Maintenir la paix au sein de notre communauté.\n` +
          `Nous aider à créer de nouvelles et meilleures fonctionnalités.\n`
      )
      .setImage(imageURL)
      .setTimestamp();

    // ————————————————————————————————————————
    // Embed 3 — LIEN
    // ————————————————————————————————————————
    const linkEmbed = new EmbedBuilder()
      .setColor("#202225")
      .setTitle("⪩ LIEN")
      .setDescription(
        `Lvl *10* **minimum**, et ne pas avoir de warn ! . troll = ban\n` +
          `<a:vaarrow:1100688357253726299> cliquez [**ici**](https://docs.google.com/forms/d/e/1FAIpQLScg7ooDTceP8APjqmZ7D0aiWXPZg19JH29Kml-JnOwRp4lnRQ/viewform?usp=sf_link) et bonne chance ! !!`
      )
      .setImage(imageURL)
      .setTimestamp();

    // ————————————————————————————————————————
    // ENVOI
    // ————————————————————————————————————————
    await message.channel.send({
      embeds: [postuleEmbed, rulesEmbed, linkEmbed],
    });

    // Suppression du message d’invocation (safe)
    try {
      await message.delete();
    } catch (_) {}
  },
};
