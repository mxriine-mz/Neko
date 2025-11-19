require("dotenv").config();
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    once: false,

    async execute(client, member) {
        try {
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
                        content: `➜ <@${member.user.id}> a quitté **${guild.name}** *!*`
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
                            `**± Nom d'utilisateur :** ${member.displayName ?? member.user.username}\n` +
                            `**± ID :** ${member.user.id}\n` +
                            `**± Créé le :** <t:${Math.floor(member.user.createdTimestamp / 1000)}:f> ` +
                            `(<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)\n` +
                            `**± Rejoint le :** <t:${Math.floor(member.joinedTimestamp / 1000)}:f> ` +
                            `(<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`
                        )
                        .setFooter({
                            text: "L'utilisateur a quitté le serveur",
                            iconURL: member.user.displayAvatarURL({ dynamic: true })
                        })
                        .setTimestamp();

                    logChannel.send({ embeds: [embed] }).catch(() => {});
                }
            }

        } catch (err) {
            console.error("[guildMemberRemove] Erreur :", err);
        }
    },
};
