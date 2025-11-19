const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "helpcmd-menu",

    runInteraction: async (client, interaction, guildSettings, userSettings) => {
        try {
            const selected = interaction.values[0].toLowerCase();

            // Chercher la commande
            const cmd = client.commands.get(selected);
            const prefix = guildSettings?.prefix || "&";

            if (!cmd) {
                return interaction.update({
                    content: `❌ La commande \`${selected}\` est introuvable.`,
                    embeds: [],
                    components: []
                });
            }

            // Construire l’embed
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
                        value:
                            cmd.usage
                                ? `\`\`\`${prefix}${cmd.usage}\`\`\``
                                : "`Aucun usage spécifié.`"
                    },
                    {
                        name: "Exemples",
                        value:
                            cmd.examples
                                ? `\`\`\`${cmd.examples
                                      .map((x) => `${prefix}${x}`)
                                      .join("\n")}\`\`\``
                                : "`Aucun exemple disponible.`"
                    }
                )
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

            await interaction.update({ embeds: [embed] });

        } catch (err) {
            console.error("Erreur helpcmd-menu :", err);

            // Sécurisé : pas de crash
            return interaction.update({
                content: "❌ Une erreur est survenue.",
                embeds: [],
                components: []
            });
        }
    }
};
