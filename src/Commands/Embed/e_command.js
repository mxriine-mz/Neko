const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "e_command",
  category: "embed",
  permissions: PermissionFlagsBits.KickMembers,
  ownerOnly: true,
  usage: "e_command",
  examples: ["e_command"],
  description: "Affiche automatiquement toutes les commandes du bot",

  run: async (client, message) => {
    // On supprime le message utilisateur avant tout
    try {
      await message.delete();
    } catch (_) {}

    const chunk = (array, size) =>
      array.reduce((acc, _, i) => (i % size ? acc : [...acc, array.slice(i, i + size)]), []);

    const categoriesPath = path.join(__dirname, "..");
    const directories = fs.readdirSync(categoriesPath);

    const embed = new EmbedBuilder()
      .setColor("#202225")
      .setTitle("<:books:1444689290364719195> Liste automatique des commandes")
      .setDescription("Voici toutes les commandes organisées par catégorie :")
      .setTimestamp()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    for (const dir of directories) {
      const commandsPath = path.join(categoriesPath, dir);
      const files = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));
      if (!files.length) continue;

      const formatted = chunk(
        files.map((f) => "`" + f.replace(".js", "") + "`"),
        5
      ).map((line) => line.join("   |   "));

      embed.addFields({
        name: `<:filefolder:1444689288972468326> ${dir}`,
        value: formatted.join("\n"),
      });
    }

    // On envoie l’embed final
    await message.channel.send({ embeds: [embed] });
  },
};
