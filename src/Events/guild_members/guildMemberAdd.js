require("dotenv").config();
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    once: false,

    async execute(client, member) {
        try {
            // Création entrée DB user si non existant
            await client.createUser(member.user);

            const guildData = await client.getGuild(member.guild);
            if (!guildData) return;

            const guild = member.guild;

            // —————————————————————————
            // ANNOUNCE
            // —————————————————————————
            if (guildData.announce === true && guildData.announceChannel) {
                const announceChannel = client.channels.cache.get(guildData.announceChannel);

                if (announceChannel) {
                    announceChannel.send({
                        content: `➜ Welcome to **${guild.name}**, <@${member.user.id}> !`
                    }).catch(() => {});
                }
            }

            // —————————————————————————
            // LOGS
            // —————————————————————————
            if (guildData.logs === true && guildData.logsChannel) {
                const logChannel = client.channels.cache.get(guildData.logsChannel);

                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor(0x202225)
                        .setAuthor({
                            name: member.user.tag,
                            iconURL: member.user.displayAvatarURL({ dynamic: true })
                        })
                        .setDescription(
                            `**± Nom d'utilisateur :** ${member.displayName}\n` +
                            `**± ID :** ${member.user.id}\n` +
                            `**± Créé le :** <t:${Math.floor(member.user.createdTimestamp / 1000)}:f> ` +
                            `(<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)\n` +
                            `**± Rejoint le :** <t:${Math.floor(member.joinedTimestamp / 1000)}:f> ` +
                            `(<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`
                        )
                        .setFooter({
                            text: "L'utilisateur a rejoint le serveur",
                            iconURL: member.user.displayAvatarURL({ dynamic: true })
                        })
                        .setTimestamp();

                    logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }

            // —————————————————————————
            // RÔLE AUTOMATIQUE POUR LES BOTS
            // —————————————————————————
            if (member.user.bot && process.env.BOT_ROLE_ID) {
                const role = guild.roles.cache.get(process.env.BOT_ROLE_ID);
                if (role) member.roles.add(role).catch(() => {});
            }

            // —————————————————————————
            // RÔLE AUTO POUR CE SERVEUR SPÉCIFIQUE
            // —————————————————————————
            if (guild.id === process.env.GUILD_ID && process.env.ROLE_ID) {
                const role = guild.roles.cache.get(process.env.ROLE_ID);
                if (role) member.roles.add(role).catch(() => {});
            }

        } catch (err) {
            console.error("[guildMemberAdd] Erreur :", err);
        }
    }
};
