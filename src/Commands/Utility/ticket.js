const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { createTicketMenu } = require("../../Assets/SelectMenu/TicketMenu");

module.exports = {
  name: "ticket",
  category: "utility",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: true,
  usage: "ticket",
  examples: ["ticket"],
  description: "Envoie un embed permettant d’ouvrir un ticket.",

  run: async (client, message) => {
    const TicketMenu = createTicketMenu(client);

    const embed = new EmbedBuilder()
      .setColor(0x202225)
      .setTitle("・HELP SUPPORT")
      .setDescription(
        "**Comment pouvons-nous vous aider ?**\n" +
          "Si vous avez besoin d'aide concernant le serveur, cliquez sur le bouton **« Ouvrir un ticket »** ci-dessous !"
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png"
      )
      .setFooter({ text: "・Équipe Tokimeku" });

    await message.channel.send({
      embeds: [embed],
      components: [TicketMenu],
    });

    if (message.deletable) message.delete().catch(() => {});
  },
};
