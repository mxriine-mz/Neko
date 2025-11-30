const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "e_rules",
  category: "embed",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: true,
  usage: "e_rules",
  examples: ["e_rules"],
  description: "Envoie un embed avec les règles",

  run: async (client, message) => {

    const imageURL =
      "https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png";

    // ——————————————————————————————————————
    // EMBED : RULES
    // ——————————————————————————————————————
    const rulesEmbed = new EmbedBuilder()
      .setColor("#202225")
      .setTitle("・RULES")
      .setDescription(
        `・Appliqué les [tos](https://discord.com/terms) & [guild](https://discord.com/guidelines)` +
        `\n・**Ne pas** révéler d'informations sur **vous** ou **d'autres personnes**` +
        `\n・Ne pas créer \`d'atmosphère toxique\` *!*` +
        `\n・__Respecter__ tout les membres *!*` +
        `\n・Pas d'homophobie de racisme *etc*... ` +
        `\n ➜ **Ne pas** se promouvoir soi-même`
      )
      .setImage(imageURL)
      .setTimestamp()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    // ——————————————————————————————————————
    // EMBED : CHANNELS
    // ——————————————————————————————————————
    const channelsEmbed = new EmbedBuilder()
      .setColor("#202225")
      .setTitle("CHANNELS .")
      .setDescription(
        `・fr & eng server *!*` +
        `\n・**Ne pas** utiliser d'autres langagues que le *français* ou *l'anglais* !` +
        `\n・Conserver un surnom **mentionnable** ! , ⁺` +
        `\n・__Respecter__ les **sujets** des channels *!!*` +
        `\n・Les __messages__ **nsfw** ou __pfp__ **ne sont pas** autorisés. \n *!* __sauf si salon dédié__ *!*` +
        `\n\u200B` // → ligne invisible pour égaliser la hauteur
      )
      .setImage(imageURL)
      .setTimestamp();

    // ——————————————————————————————————————
    // EMBED : WARNS
    // ——————————————————————————————————————
    const warnEmbed = new EmbedBuilder()
      .setColor("#202225")
      .setTitle("⪩ WARNS ─")
      .setDescription(
        `・\`2.0\` **warns** 、__mute__` +
        `\n・\`3.0\` **warns**﹐ __temp kick__` +
        `\n・\`4.0\` **warns** ﹑ __ban__ !`
      )
      .setImage(imageURL)
      .setTimestamp();

    // ——————————————————————————————————————
    // ENVOI
    // ——————————————————————————————————————
    await message.channel.send({
      embeds: [rulesEmbed, channelsEmbed, warnEmbed],
    });

    try {
      await message.delete();
    } catch (e) {}
  },
};
