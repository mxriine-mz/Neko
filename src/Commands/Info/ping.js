const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
  name: "ping",
  category: "info",
  permissions: PermissionFlagsBits.KickMembers, // tu veux ça → je laisse
  ownerOnly: false,
  usage: "ping",
  examples: ["ping"],
  description: "Affiche le ping du bot",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message) => {
    const tempMsg = await message.channel.send(
      "On essaie de pong. . . un instant *!*"
    );

    const embed = new EmbedBuilder()
      .setColor(0x202225)
      .setTitle("🏓 Pong !")
      .setDescription("Affiche le ping du bot")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .addFields(
        {
          name: "Latence API",
          value: `\`\`\`${client.ws.ping}ms\`\`\``,
          inline: true,
        },
        {
          name: "Latence BOT",
          value: `\`\`\`${Math.abs(
            tempMsg.createdTimestamp - message.createdTimestamp
          )}ms\`\`\``,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    await tempMsg.edit({ content: " ", embeds: [embed] });
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  runInteraction: async (client, interaction) => {
    const tempMsg = await interaction.reply({
      content: "On essaie de pong. . . un instant *!*",
      withResponse: true,
    });

    const embed = new EmbedBuilder()
      .setColor(0x202225)
      .setTitle("🏓 Pong !")
      .setDescription("Affiche le ping du bot")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .addFields(
        {
          name: "Latence API",
          value: `\`\`\`${client.ws.ping}ms\`\`\``,
          inline: true,
        },
        {
          name: "Latence BOT",
          value: `\`\`\`${Math.abs(
            tempMsg.createdTimestamp - interaction.createdTimestamp
          )}ms\`\`\``,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
