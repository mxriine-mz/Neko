require("dotenv").config();
const { ChannelType, PermissionsBitField } = require("discord.js");

const TEMPLATE_VC_ID = process.env.VC_ID;

module.exports = {
    name: "voiceStateUpdate",

    async execute(oldState, newState) {
        if (!oldState || !newState) return;

        const guild = newState.guild;
        const member = newState.member;

        // 1️⃣ Quand quelqu'un ENTRE dans le salon modèle
        if (newState.channelId === TEMPLATE_VC_ID) {

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
                            PermissionsBitField.Flags.MuteMembers,
                            PermissionsBitField.Flags.DeafenMembers,
                            PermissionsBitField.Flags.ManageChannels   // <- clé ici
                        ]
                    }
                ]
            });

            // Move
           if (member.voice.channelId === TEMPLATE_VC_ID) {
                    member.voice.setChannel(newChannel).catch(() => {});
                }
        }


        // 2️⃣ SUPPRESSION uniquement si :
        // - C'est un salon créé (commence par "・")
        // - Il n'y a PLUS PERSONNE dedans
        // Suppression quand le salon créé devient vide
        // Suppression quand le salon temporaire est vide
        if (
            oldState.channel &&
            oldState.channel.id !== TEMPLATE_VC_ID && // <- protège le salon modèle
            oldState.channel.name.startsWith("・") &&
            oldState.channel.members.size === 0
        ) {
            setTimeout(() => {
                if (
                    oldState.channel &&
                    oldState.channel.members.size === 0 &&
                    oldState.channel.id !== TEMPLATE_VC_ID
                ) {
                    oldState.channel.delete().catch(() => {});
                }
            }, 1500);
        }
    }
};
