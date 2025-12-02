require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const dayjs = require("dayjs");

module.exports = {
    name: "guildMemberRemove",
    once: false,

    async execute(client, member) {
        console.log("guildMemberRemove EVENT LOADED");

        try {
            const guildData = await client.getGuild(member.guild);
            if (!guildData) return;

            const guild = member.guild;

            // —————————————————————————
            // UPDATE DB : marquer sortie + date
            // —————————————————————————
            await client.updateUser(member.user, {
                inGuild: false,
                leftAt: new Date(),
            });

            // —————————————————————————
            // DATE FORMATTING (propre wé)
            // —————————————————————————
            const createdAt = dayjs(member.user.createdAt).format("DD/MM/YY HH:mm:ss");
            const joinedAt  = dayjs(member.joinedAt).format("DD/MM/YY HH:mm:ss");
            const leftAt    = dayjs().format("DD/MM/YY HH:mm:ss");

            // —————————————————————————
            // ANNOUNCE MESSAGE
            // —————————————————————————
            if (guildData.welcomeChannel) {
                const welcomeChannel = client.channels.cache.get(guildData.welcomeChannel);

                if (welcomeChannel) {
                    welcomeChannel.send({
                        content: `➜ <@${member.user.id}> a quitté **${guild.name}** *!*`
                    }).catch(() => {});
                }
            }

            // —————————————————————————
            // LOGS CHANNEL
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
                            `**± Créé le :** ${createdAt}\n` +
                            `**± Rejoint le :** ${joinedAt}\n` +
                            `**± Parti le :** ${leftAt}`
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
