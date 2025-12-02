const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags
} = require("discord.js");

const { createMainMenu } = require("../../Assets/SelectMenu/HelpMainMenu.js");
const { createCmdMenu } = require("../../Assets/SelectMenu/HelpCmdMenu.js");

module.exports = {
  name: "help",
  category: "info",
  permissions: PermissionFlagsBits.SendMessages,
  ownerOnly: false,
  usage: "help [commande]",
  examples: ["help", "help say"],
  description: "Affiche l'aide générale ou celle d'une commande précise",

  // ————————————————————————————————————————
  // PREFIX VERSION
  // ————————————————————————————————————————
  run: async (client, message, args, guildSettings, userSettings) => {
    const query = args[0]?.toLowerCase() || null;

    // ————————————————
    // Si l’utilisateur demande une commande
    // ————————————————
    if (query) {
      const cmd = client.commands.get(query);

      if (!cmd) {
        return message.reply(`❌ La commande \`${query}\` est introuvable.`);
      }

      const prefix = guildSettings?.prefix || "&";

      const embed = new EmbedBuilder()
        .setColor(0x202225)
        .setAuthor({
          name: "Neko",
          iconURL: client.user.displayAvatarURL({ dynamic: true })
        })
        .setTitle(`Commande : ${cmd.name}`)
        .setDescription(`> ${cmd.description || "Pas de description."}`)
        .addFields(
          {
            name: "Utilisation",
            value: cmd.usage
              ? `\`\`\`${prefix}${cmd.usage}\`\`\``
              : "`Aucun usage spécifié.`"
          },
          {
            name: "Exemples",
            value: cmd.examples
              ? `\`\`\`${cmd.examples.map(x => `${prefix}${x}`).join("\n")}\`\`\``
              : "`Aucun exemple disponible.`"
          }
        )
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

      return message.channel.send({ embeds: [embed] });
    }

    // ————————————————
    // Sinon → menu principal
    // ————————————————
    let HelpMainMenu;
    try {
      HelpMainMenu = createMainMenu(client);
    } catch (err) {
      console.error("[HELP] Impossible de créer le menu :", err);
      return message.reply("Erreur interne : impossible de générer le menu d'aide.");
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Neko",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `Bienvenue dans l'aide de **${client.user.username}** !  
Utilisez le **menu de sélection ci-dessous** pour naviguer entre les catégories.`
      )
      .addFields({
        name: "Commandes",
        value: ">>> Parcourez les catégories à l’aide du menu.",
      })
      .setImage(
        "https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png"
      )
      .setColor("#202225");

    return message.channel.send({
      embeds: [embed],
      components: [HelpMainMenu],
    });
  },

  // ————————————————————————————————————————
  // SLASH VERSION
  // ————————————————————————————————————————
  options: [
    {
      name: "commande",
      description: "Commande dont vous voulez l'aide",
      type: ApplicationCommandOptionType.String,
      required: false,
      autocomplete: true,
    },
  ],

  // ————————————————————————————————————————
  // SLASH AUTOCOMPLETE
  // ————————————————————————————————————————
  autocompleteRun: async (interaction) => {
    const focused = interaction.options.getFocused();
    const commands = [...interaction.client.commands.keys()];

    const filtered = commands.filter(c =>
      c.toLowerCase().startsWith(focused.toLowerCase())
    );

    await interaction.respond(
      filtered.slice(0, 25).map(c => ({
        name: c,
        value: c,
      }))
    );
  },

  // ————————————————————————————————————————
  // SLASH RUN
  // ————————————————————————————————————————
  runInteraction: async (client, interaction, guildSettings, userSettings) => {
    const cmdQuery = interaction.options.getString("commande");
    const prefix = guildSettings?.prefix || process.env.PREFIX;

    // ————————————————
    // Si aide d’une commande précise
    // ————————————————
    if (cmdQuery) {
      const cmd = client.commands.get(cmdQuery.toLowerCase());

      if (!cmd) {
        return interaction.reply({
          content: `La commande \`${cmdQuery}\` est introuvable.`,
          flags: MessageFlags.Ephemeral,
        });
      }

      const embed = new EmbedBuilder()
        .setColor(0x202225)
        .setAuthor({
          name: "Neko",
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle(`Commande : ${cmd.name}`)
        .setDescription(`> ${cmd.description || "Pas de description."}`)
        .addFields(
          {
            name: "Utilisation",
            value: cmd.usage
              ? `\`\`\`${prefix}${cmd.usage}\`\`\``
              : "`Aucun usage spécifié.`",
          },
          {
            name: "Exemples",
            value: cmd.examples
              ? `\`\`\`${cmd.examples.map(x => `${prefix}${x}`).join("\n")}\`\`\``
              : "`Aucun exemple disponible.`",
          }
        )
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

      return interaction.reply({ embeds: [embed] });
    }

    // ————————————————
    // Sinon → page principale + menu
    // ————————————————
    const mainMenu = createMainMenu(client);

    const embed = new EmbedBuilder()
      .setColor(0xFFB6C1)
      .setAuthor({
        name: "Neko",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `Bienvenue dans l'aide de **${client.user.username}** !  
Utilisez le menu ci-dessous pour naviguer entre les catégories.`
      )
      .addFields({
        name: "Commandes",
        value: ">>> Parcourez les catégories à l’aide du menu.",
      })
      .setImage(
        "https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png"
      );

    return interaction.reply({
      embeds: [embed],
      components: [mainMenu],
    });
  },
};
