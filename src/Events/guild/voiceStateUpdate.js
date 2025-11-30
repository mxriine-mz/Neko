require("dotenv").config();
const { ChannelType, PermissionsBitField } = require("discord.js");

const TEMPLATE_VC_IDS = (process.env.VC_IDS ?? "")
  .split(",")
  .map(id => id.trim())
  .filter(id => id.length > 0);

module.exports = {
  name: "voiceStateUpdate",

  async execute(oldState, newState) {
    if (!oldState || !newState) return;
    if (TEMPLATE_VC_IDS.length === 0) return;

    const guild = newState.guild;
    const member = newState.member;

    // CRÉATION
    if (newState.channelId && TEMPLATE_VC_IDS.includes(newState.channelId)) {

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

      if (member.voice.channelId === newState.channelId) {
        member.voice.setChannel(newChannel).catch(() => {});
      }
    }

    // SUPPRESSION
    if (
      oldState.channel &&
      oldState.channel.members.size === 0 &&
      oldState.channel.name.startsWith("・") &&
      !TEMPLATE_VC_IDS.includes(oldState.channel.id)
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
