const { PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const User = require("../../Models/user.js");

module.exports = {
  name: "warn",
  category: "moderation",
  permissions: PermissionFlagsBits.ModerateMembers,
  ownerOnly: false,
  usage: "warn <@user> <raison>",
  examples: ["warn @user spam"],
  description: "Ajoute un avertissement à un utilisateur.",
  options: [
    {
      name: "user",
      description: "Utilisateur à avertir",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "raison",
      description: "Raison de l'avertissement",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply("Tu n'as pas la permission d'avertir des membres.");
    const target = message.mentions.users.first();
    const reason = args.slice(1).join(" ");
    if (!target) return message.reply("Merci de mentionner un utilisateur.");
    if (!reason) return message.reply("Merci d'indiquer une raison.");
    if (target.id === message.author.id) return message.reply("Tu ne peux pas t'avertir toi-même.");
    if (target.bot) return message.reply("Tu ne peux pas avertir un bot.");

    let userData = await User.findOne({ id: target.id });
    if (!userData) {
      userData = new User({ id: target.id, user: target.tag });
    }
    userData.warnings.push({ reason, moderator: message.author.id });
    await userData.save();

    const embed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setDescription(`⚠️ ${target} a reçu un avertissement.\n**Raison :** ${reason}\n**Total :** ${userData.warnings.length}`);
    await message.channel.send({ embeds: [embed] });
  },

  runInteraction: async (client, interaction) => {
    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("raison");
    if (target.id === interaction.user.id)
      return interaction.reply({ content: "Tu ne peux pas t'avertir toi-même.", ephemeral: true });
    if (target.bot)
      return interaction.reply({ content: "Tu ne peux pas avertir un bot.", ephemeral: true });
    let userData = await User.findOne({ id: target.id });
    if (!userData) {
      userData = new User({ id: target.id, user: target.tag });
    }
    userData.warnings.push({ reason, moderator: interaction.user.id });
    await userData.save();
    const embed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setDescription(`⚠️ ${target} a reçu un avertissement.\n**Raison :** ${reason}\n**Total :** ${userData.warnings.length}`);
    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
