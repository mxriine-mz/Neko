require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const { createMainMenu } = require("../../Assets/SelectMenu/HelpMainMenu.js");
const { createCmdMenu } = require("../../Assets/SelectMenu/HelpCmdMenu.js");

module.exports = {
    name: "helpmain-menu",

    runInteraction: async (client, interaction, guildSettings, userSettings) => {
        const selected = interaction.values[0];
        const prefix = guildSettings?.prefix || "&";

        // ——————————————————————————————————————
        // Menus prêts à être réinjectés dans l’UI
        // ——————————————————————————————————————
        const mainMenu = createMainMenu(client);
        mainMenu.components[0].setPlaceholder(selected);

        const [cmdMenu1, cmdMenu2] = createCmdMenu(client, interaction);

        // ——————————————————————————————————————
        // PAGE PRINCIPALE
        // ——————————————————————————————————————
        if (selected === "Main Menu") {
            const embed = new EmbedBuilder()
                .setColor(0x202225)
                .setAuthor({
                    name: "Neko",
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(
                    `Bienvenue dans l'aide de ${client.user}!  
                    Vous trouverez ici toutes les commandes disponibles.`
                )
                .addFields({
                    name: "Commandes",
                    value: `>>> Utilisez le menu ci-dessous pour afficher les catégories.`,
                })
                .setImage(
                    "https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png"
                );

            return interaction.update({
                embeds: [embed],
                components: [mainMenu],
            });
        }

        // ——————————————————————————————————————
        // AFFICHAGE D’UNE CATÉGORIE
        // ——————————————————————————————————————
        const cmds = [...client.prefixCommands.values(), ...client.commands.values()]
            .filter(c => c.category?.toLowerCase() === selected.toLowerCase());

        if (!cmds.length) {
            return interaction.update({
                content: `❌ Aucune commande trouvée dans la catégorie **${selected}**.`,
                embeds: [],
                components: [mainMenu],
            });
        }

        const list = cmds
            .map(cmd => `\`${prefix}${cmd.name}\` - ${cmd.description}`)
            .slice(0, 10)
            .join("\n");

        const embed = new EmbedBuilder()
            .setColor(0x202225)
            .setAuthor({
                name: "Neko",
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTitle(`Catégorie : ${selected}`)
            .setDescription(list);

        const components = [mainMenu];
        if (cmdMenu1) components.push(cmdMenu1);
        if (cmdMenu2) components.push(cmdMenu2);

        return interaction.update({
            embeds: [embed],
            components,
        });
    },
};
