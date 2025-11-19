const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "e_info",
  category: "embed",
  permissions: PermissionFlagsBits.KickMembers, // tu veux ça + ownerOnly → je laisse
  ownerOnly: true,
  usage: "e_info",
  examples: ["e_info"],
  description: "Envoie un embed avec des informations",

  run: async (client, message) => {
    // Embed image
    const imageEmbed = new EmbedBuilder()
      .setImage(
        "https://i.pinimg.com/originals/2b/61/36/2b613672e6a75bedba78965c4d58ba51.jpg"
      )
      .setColor("#202225");

    // Embed info principal
    const infoEmbed = new EmbedBuilder()
      .setTitle("・`🦎` , US ")
      .setDescription(
        `;; \`🍙\` own - <@${message.guild.ownerId}> ;; \`10.10.22\`
❱❱ ⋮ \`☁️\` ❜ community & safe place

⪩﹒**fr** & **eng**`
      )
      .setColor("#202225")
      .setTimestamp()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    return message.channel.send({
      embeds: [imageEmbed, infoEmbed],
    });
  },
};
