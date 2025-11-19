const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { createMainMenu } = require("../../Assets/SelectMenu/HelpMainMenu.js");

module.exports = {
  name: "help",
  category: "info",
  permissions: PermissionFlagsBits.KickMembers, // tu voulais ça, je le laisse
  ownerOnly: false,
  usage: "help <command>",
  examples: ["help", "help say", "help emit"],
  description: "Commande d'aide",

  run: async (client, message, args, guildSettings, userSettings) => {
    // Menu principal
    let HelpMainMenu;
    try {
      HelpMainMenu = createMainMenu(client);
    } catch (err) {
      console.error("[HELP] Impossible de créer le menu :", err);
      return message.reply(
        "Erreur interne : impossible de générer le menu d'aide."
      );
    }

    // Embed d’aide
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Neko",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `Bienvenue dans l'aide de **${client.user.username}** !  
Vous trouverez ici toutes les commandes disponibles grâce au menu ci-dessous.`
      )
      .addFields({
        name: "Commandes",
        value:
          ">>> Retrouvez toutes les commandes en utilisant le **menu de sélection ci-dessous**.",
      })
      .setImage(
        "https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png"
      )
      .setColor("#FFB6C1");

    return message.channel.send({
      embeds: [embed],
      components: [HelpMainMenu],
    });
  },
};
