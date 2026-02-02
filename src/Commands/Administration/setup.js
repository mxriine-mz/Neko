const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

// Si tu as un Logger perso, tu peux le require ici
// const Logger = require("../Utils/Logger");

module.exports = {
    name: "setup",
    category: "administration",
    permissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: "setup <module>",
    examples: [
        "setup logs enable",
        "setup welcome set-message",
        "setup annonces enable",
        "setup autorole enable",
        "setup starboard enable",
        "setup tickets enable"
    ],
    description: "Configurer les systèmes du serveur (logs, welcome, bye, annonces, tickets, autorole, starboard).",

    // ———————————————————————————————————————
    // SLASH COMMAND BUILDER
    // ———————————————————————————————————————
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Configurer les systèmes du serveur.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        // ==========================
        // LOGS
        // ==========================
        .addSubcommandGroup(group =>
            group
                .setName("logs")
                .setDescription("Configurer le système de logs.")
                .addSubcommand(sub =>
                    sub
                        .setName("enable")
                        .setDescription("Activer les logs.")
                        .addChannelOption(opt =>
                            opt
                                .setName("salon")
                                .setDescription("Salon où seront envoyés les logs.")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("disable")
                        .setDescription("Désactiver les logs.")
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-channel")
                        .setDescription("Modifier le salon des logs.")
                        .addChannelOption(opt =>
                            opt
                                .setName("salon")
                                .setDescription("Nouveau salon des logs.")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("toggle-type")
                        .setDescription("Activer/désactiver un type de log.")
                        .addStringOption(opt =>
                            opt
                                .setName("type")
                                .setDescription("Type de logs.")
                                .setRequired(true)
                                .addChoices(
                                    { name: "Messages", value: "messages" },
                                    { name: "Modération", value: "moderation" },
                                    { name: "Joins", value: "joins" },
                                    { name: "Leaves", value: "leaves" },
                                    { name: "Rôles", value: "roles" },
                                    { name: "Salons", value: "channels" },
                                    { name: "Bans", value: "bans" },
                                    { name: "Boosts", value: "boosts" }
                                )
                        )
                        .addStringOption(opt =>
                            opt
                                .setName("état")
                                .setDescription("Activer ou désactiver.")
                                .setRequired(true)
                                .addChoices(
                                    { name: "On", value: "on" },
                                    { name: "Off", value: "off" }
                                )
                        )
                )
        )

        // ==========================
        // WELCOME
        // ==========================
        .addSubcommandGroup(group =>
            group
                .setName("welcome")
                .setDescription("Configurer le système de bienvenue.")
                .addSubcommand(sub =>
                    sub
                        .setName("enable")
                        .setDescription("Activer le système de bienvenue.")
                        .addChannelOption(opt =>
                            opt
                                .setName("salon")
                                .setDescription("Salon de bienvenue.")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("disable")
                        .setDescription("Désactiver le système de bienvenue.")
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-channel")
                        .setDescription("Modifier le salon de bienvenue.")
                        .addChannelOption(opt =>
                            opt
                                .setName("salon")
                                .setDescription("Nouveau salon de bienvenue.")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-message")
                        .setDescription("Définir le message de bienvenue.")
                        .addStringOption(opt =>
                            opt
                                .setName("message")
                                .setDescription("Message de bienvenue (supporte {user}, {server}, {membercount}).")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-image")
                        .setDescription("Définir ou désactiver l'image de bienvenue.")
                        .addStringOption(opt =>
                            opt
                                .setName("image")
                                .setDescription("URL de l'image ou `off` pour désactiver.")
                                .setRequired(true)
                        )
                )
        )

        // ==========================
        // BYE
        // ==========================
        .addSubcommandGroup(group =>
            group
                .setName("bye")
                .setDescription("Configurer le système d'au revoir.")
                .addSubcommand(sub =>
                    sub
                        .setName("enable")
                        .setDescription("Activer le système d'au revoir.")
                        .addChannelOption(opt =>
                            opt
                                .setName("salon")
                                .setDescription("Salon d'au revoir.")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("disable")
                        .setDescription("Désactiver le système d'au revoir.")
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-channel")
                        .setDescription("Modifier le salon d'au revoir.")
                        .addChannelOption(opt =>
                            opt
                                .setName("salon")
                                .setDescription("Nouveau salon d'au revoir.")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-message")
                        .setDescription("Définir le message d'au revoir.")
                        .addStringOption(opt =>
                            opt
                                .setName("message")
                                .setDescription("Message d'au revoir (supporte {user}, {server}, {membercount}).")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-image")
                        .setDescription("Définir ou désactiver l'image d'au revoir.")
                        .addStringOption(opt =>
                            opt
                                .setName("image")
                                .setDescription("URL de l'image ou `off` pour désactiver.")
                                .setRequired(true)
                        )
                )
        )

        // ==========================
        // ANNONCES
        // ==========================
        .addSubcommandGroup(group =>
            group
                .setName("annonces")
                .setDescription("Configurer le système d'annonces.")
                .addSubcommand(sub =>
                    sub
                        .setName("enable")
                        .setDescription("Activer les annonces.")
                        .addChannelOption(opt =>
                            opt
                                .setName("salon")
                                .setDescription("Salon des annonces.")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("disable")
                        .setDescription("Désactiver les annonces.")
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-ping")
                        .setDescription("Configurer le ping par défaut des annonces.")
                        .addStringOption(opt =>
                            opt
                                .setName("ping")
                                .setDescription("Type de ping.")
                                .setRequired(true)
                                .addChoices(
                                    { name: "Aucun", value: "none" },
                                    { name: "@here", value: "here" },
                                    { name: "@everyone", value: "everyone" }
                                )
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-embed")
                        .setDescription("Activer ou désactiver l'utilisation d'embed.")
                        .addStringOption(opt =>
                            opt
                                .setName("état")
                                .setDescription("On / Off.")
                                .setRequired(true)
                                .addChoices(
                                    { name: "On", value: "on" },
                                    { name: "Off", value: "off" }
                                )
                        )
                )
        )

        // ==========================
        // AUTOROLE
        // ==========================
        .addSubcommandGroup(group =>
            group
                .setName("autorole")
                .setDescription("Configurer l'auto-rôle.")
                .addSubcommand(sub =>
                    sub
                        .setName("enable")
                        .setDescription("Activer l'auto-rôle.")
                        .addRoleOption(opt =>
                            opt
                                .setName("rôle")
                                .setDescription("Rôle à donner automatiquement.")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("disable")
                        .setDescription("Désactiver l'auto-rôle.")
                )
        )

        // ==========================
        // STARBOARD
        // ==========================
        .addSubcommandGroup(group =>
            group
                .setName("starboard")
                .setDescription("Configurer le starboard.")
                .addSubcommand(sub =>
                    sub
                        .setName("enable")
                        .setDescription("Activer le starboard.")
                        .addChannelOption(opt =>
                            opt
                                .setName("salon")
                                .setDescription("Salon du starboard.")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("disable")
                        .setDescription("Désactiver le starboard.")
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-threshold")
                        .setDescription("Définir le nombre d'étoiles requis.")
                        .addIntegerOption(opt =>
                            opt
                                .setName("seuil")
                                .setDescription("Nombre minimal de ⭐ (par défaut: 3).")
                                .setRequired(true)
                                .setMinValue(1)
                        )
                )
        )

        // ==========================
        // TICKETS
        // ==========================
        .addSubcommandGroup(group =>
            group
                .setName("tickets")
                .setDescription("Configurer le système de tickets.")
                .addSubcommand(sub =>
                    sub
                        .setName("enable")
                        .setDescription("Activer le système de tickets.")
                        .addChannelOption(opt =>
                            opt
                                .setName("catégorie")
                                .setDescription("Catégorie où seront créés les tickets.")
                                .addChannelTypes(ChannelType.GuildCategory)
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("disable")
                        .setDescription("Désactiver le système de tickets.")
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-staff-role")
                        .setDescription("Définir le rôle staff pour les tickets.")
                        .addRoleOption(opt =>
                            opt
                                .setName("rôle")
                                .setDescription("Rôle staff.")
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-transcript")
                        .setDescription("Activer/désactiver les transcripts de tickets.")
                        .addStringOption(opt =>
                            opt
                                .setName("état")
                                .setDescription("On / Off.")
                                .setRequired(true)
                                .addChoices(
                                    { name: "On", value: "on" },
                                    { name: "Off", value: "off" }
                                )
                        )
                )
                .addSubcommand(sub =>
                    sub
                        .setName("set-logs-channel")
                        .setDescription("Définir le salon de logs des tickets.")
                        .addChannelOption(opt =>
                            opt
                                .setName("salon")
                                .setDescription("Salon des logs de tickets.")
                                .setRequired(true)
                        )
                )
        ),

    // ———————————————————————————————————————
    // HANDLER PRINCIPAL
    // ———————————————————————————————————————
    async run(client, interaction) {
        if (!interaction.guild) {
            return interaction.reply({
                content: "Cette commande ne peut être utilisée qu'en serveur.",
                ephemeral: true
            });
        }

        let guildData = await client.getGuild(interaction.guild);
        if (!guildData) {
            guildData = await client.createGuild(interaction.guild);
        }

        const group = interaction.options.getSubcommandGroup(false);
        const sub = interaction.options.getSubcommand();

        try {
            switch (group) {
                case "logs":
                    await handleLogs(interaction, guildData);
                    break;

                case "welcome":
                    await handleWelcome(interaction, guildData);
                    break;

                case "bye":
                    await handleBye(interaction, guildData);
                    break;

                case "annonces":
                    await handleAnnonces(interaction, guildData);
                    break;

                case "autorole":
                    await handleAutorole(interaction, guildData);
                    break;

                case "starboard":
                    await handleStarboard(interaction, guildData);
                    break;

                case "tickets":
                    await handleTickets(interaction, guildData);
                    break;

                default:
                    return interaction.reply({
                        content: "Module inconnu… tu as fumé les kobolos ou quoi ?",
                        ephemeral: true
                    });
            }

            await guildData.save();

        } catch (err) {
            console.error("Erreur commande /setup :", err);
            return interaction.reply({
                content: "Seigneuw Jésus… une erreur s'est produite pendant le setup.",
                ephemeral: true
            });
        }
    },

    // Pour certains handlers slash qui attendent `execute`
    async execute(interaction) {
        const client = interaction.client;
        return module.exports.run(client, interaction);
    }
};

// ———————————————————————————————————————
// FONCTIONS DE GESTION
// ———————————————————————————————————————

async function handleLogs(interaction, guildData) {
    const sub = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel("salon");
    const type = interaction.options.getString("type");
    const state = interaction.options.getString("état");

    switch (sub) {
        case "enable":
            guildData.logs.enabled = true;
            guildData.logs.channel = channel.id;
            return interaction.reply({
                content: `✅ Logs **activés** dans ${channel}.`,
                ephemeral: true
            });

        case "disable":
            guildData.logs.enabled = false;
            return interaction.reply({
                content: "✅ Logs **désactivés**.",
                ephemeral: true
            });

        case "set-channel":
            guildData.logs.channel = channel.id;
            return interaction.reply({
                content: `✅ Salon des logs mis à jour : ${channel}.`,
                ephemeral: true
            });

        case "toggle-type":
            if (!guildData.logs.types[type]) {
                // Si la clé n'existe pas encore, on initialise à false
                guildData.logs.types[type] = false;
            }

            guildData.logs.types[type] = state === "on";

            return interaction.reply({
                content: `✅ Type de logs **${type}** mis sur **${state.toUpperCase()}**.`,
                ephemeral: true
            });
    }
}

async function handleWelcome(interaction, guildData) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
        case "enable": {
            const channel = interaction.options.getChannel("salon");

            guildData.welcome.enabled = true;
            guildData.welcome.channel = channel.id;

            return interaction.reply({
                content: `✅ Système de bienvenue **activé** dans ${channel}.`,
                ephemeral: true
            });
        }

        case "disable":
            guildData.welcome.enabled = false;
            return interaction.reply({
                content: "✅ Système de bienvenue **désactivé**.",
                ephemeral: true
            });

        case "set-channel": {
            const channel = interaction.options.getChannel("salon");
            guildData.welcome.channel = channel.id;

            return interaction.reply({
                content: `✅ Salon de bienvenue mis à jour : ${channel}.`,
                ephemeral: true
            });
        }

        case "set-message": {
            const message = interaction.options.getString("message");
            guildData.welcome.message = message;

            return interaction.reply({
                content: "✅ Message de bienvenue mis à jour.",
                ephemeral: true
            });
        }

        case "set-image": {
            const image = interaction.options.getString("image");

            if (image.toLowerCase() === "off") {
                guildData.welcome.image = null;
                return interaction.reply({
                    content: "✅ Image de bienvenue **désactivée**.",
                    ephemeral: true
                });
            }

            guildData.welcome.image = image;

            return interaction.reply({
                content: "✅ Image de bienvenue mise à jour.",
                ephemeral: true
            });
        }
    }
}

async function handleBye(interaction, guildData) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
        case "enable": {
            const channel = interaction.options.getChannel("salon");

            guildData.bye.enabled = true;
            guildData.bye.channel = channel.id;

            return interaction.reply({
                content: `✅ Système d'au revoir **activé** dans ${channel}.`,
                ephemeral: true
            });
        }

        case "disable":
            guildData.bye.enabled = false;
            return interaction.reply({
                content: "✅ Système d'au revoir **désactivé**.",
                ephemeral: true
            });

        case "set-channel": {
            const channel = interaction.options.getChannel("salon");
            guildData.bye.channel = channel.id;

            return interaction.reply({
                content: `✅ Salon d'au revoir mis à jour : ${channel}.`,
                ephemeral: true
            });
        }

        case "set-message": {
            const message = interaction.options.getString("message");
            guildData.bye.message = message;

            return interaction.reply({
                content: "✅ Message d'au revoir mis à jour.",
                ephemeral: true
            });
        }

        case "set-image": {
            const image = interaction.options.getString("image");

            if (image.toLowerCase() === "off") {
                guildData.bye.image = null;
                return interaction.reply({
                    content: "✅ Image d'au revoir **désactivée**.",
                    ephemeral: true
                });
            }

            guildData.bye.image = image;

            return interaction.reply({
                content: "✅ Image d'au revoir mise à jour.",
                ephemeral: true
            });
        }
    }
}

async function handleAnnonces(interaction, guildData) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
        case "enable": {
            const channel = interaction.options.getChannel("salon");

            guildData.annonces.enabled = true;
            guildData.annonces.channel = channel.id;

            return interaction.reply({
                content: `✅ Annonces **activées** dans ${channel}.`,
                ephemeral: true
            });
        }

        case "disable":
            guildData.annonces.enabled = false;
            return interaction.reply({
                content: "✅ Annonces **désactivées**.",
                ephemeral: true
            });

        case "set-ping": {
            const ping = interaction.options.getString("ping");
            guildData.annonces.ping = ping;

            return interaction.reply({
                content: `✅ Ping par défaut des annonces : **${ping}**.`,
                ephemeral: true
            });
        }

        case "set-embed": {
            const state = interaction.options.getString("état");
            guildData.annonces.embed = state === "on";

            return interaction.reply({
                content: `✅ Mode embed pour les annonces : **${state.toUpperCase()}**.`,
                ephemeral: true
            });
        }
    }
}

async function handleAutorole(interaction, guildData) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
        case "enable": {
            const role = interaction.options.getRole("rôle");

            guildData.autorole.enabled = true;
            guildData.autorole.role = role.id;

            return interaction.reply({
                content: `✅ Auto-rôle **activé** avec le rôle ${role}.`,
                ephemeral: true
            });
        }

        case "disable":
            guildData.autorole.enabled = false;
            guildData.autorole.role = null;

            return interaction.reply({
                content: "✅ Auto-rôle **désactivé**.",
                ephemeral: true
            });
    }
}

async function handleStarboard(interaction, guildData) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
        case "enable": {
            const channel = interaction.options.getChannel("salon");

            guildData.starboard.enabled = true;
            guildData.starboard.channel = channel.id;

            return interaction.reply({
                content: `✅ Starboard **activé** dans ${channel}.`,
                ephemeral: true
            });
        }

        case "disable":
            guildData.starboard.enabled = false;
            return interaction.reply({
                content: "✅ Starboard **désactivé**.",
                ephemeral: true
            });

        case "set-threshold": {
            const seuil = interaction.options.getInteger("seuil");
            guildData.starboard.threshold = seuil;

            return interaction.reply({
                content: `✅ Seuil du starboard mis à **${seuil}⭐**.`,
                ephemeral: true
            });
        }
    }
}

async function handleTickets(interaction, guildData) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
        case "enable": {
            const category = interaction.options.getChannel("catégorie");

            guildData.tickets.enabled = true;
            guildData.tickets.category = category.id;

            return interaction.reply({
                content: `✅ Système de tickets **activé** dans la catégorie **${category.name}**.`,
                ephemeral: true
            });
        }

        case "disable":
            guildData.tickets.enabled = false;
            return interaction.reply({
                content: "✅ Système de tickets **désactivé**.",
                ephemeral: true
            });

        case "set-staff-role": {
            const role = interaction.options.getRole("rôle");
            guildData.tickets.staffRole = role.id;

            return interaction.reply({
                content: `✅ Rôle staff des tickets mis à ${role}.`,
                ephemeral: true
            });
        }

        case "set-transcript": {
            const state = interaction.options.getString("état");
            guildData.tickets.transcript = state === "on";

            return interaction.reply({
                content: `✅ Transcripts de tickets : **${state.toUpperCase()}**.`,
                ephemeral: true
            });
        }

        case "set-logs-channel": {
            const channel = interaction.options.getChannel("salon");
            guildData.tickets.logsChannel = channel.id;

            return interaction.reply({
                content: `✅ Salon de logs des tickets mis à ${channel}.`,
                ephemeral: true
            });
        }
    }
}
