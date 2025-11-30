require("dotenv").config();
const { ChannelType, PermissionsBitField } = require("discord.js");

// Plusieurs salons modèles (liste d'IDs séparés par virgules dans .env)
const TEMPLATE_VC_IDS = process.env.VC_IDS.split(",");

module.exports = {
    name: "voiceStateUpdate",

    async execute(oldState, newState) {
        if (!oldState || !newState) return;

        const guild = newState.guild;
        const member = newState.member;

        // 1️⃣ Si l'utilisateur entre dans un des salons modèles
        if (TEMPLATE_VC_IDS.includes(newState.channelId)) {

            const newChannel = await guild.channels.create({
                name: `・ ${member.user.username}`,
                type: ChannelType.GuildVoice,
                parent: newState.channel.parentId,
                permissionOverwrites: [
                    {
                        id: member.id,
                        allow: [
                            PermissionsBitField.Flags.Connect,
                            PermissionsBitField.Flags.MoveMembers,
                            PermissionsBitField.Flags.ManageChannels
                        ]
                    }
                ]
            });

            // Move si toujours dans le salon modèle
            if (member.voice.channelId === newState.channelId) {
                member.voice.setChannel(newChannel).catch(() => {});
            }
        }

        // 2️⃣ Supprimer les salons créés quand ils sont vides
        if (
            oldState.channel &&
            oldState.channel.name.startsWith("・") &&
            !TEMPLATE_VC_IDS.includes(oldState.channel.id) &&
            oldState.channel.members.size === 0
        ) {
        
            setTimeout(() => {
                if (
                    oldState.channel &&
                    oldState.channel.members.size === 0 &&
                    !TEMPLATE_VC_IDS.includes(oldState.channel.id)
                ) {
                    oldState.channel.delete().catch(() => {});
                }
            }, 1500);
        }
    }
};
