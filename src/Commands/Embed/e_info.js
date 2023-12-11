const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'e_info',
    category: 'embed',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: true,
    usage: 'e_info',
    examples: ['e_info'],
    description: 'Envoie un embed avec des informations',

    run: async (client, message, args, guildSettings, userSettings) => {

        const embed = {
            image: {
                url: 'https://i.pinimg.com/originals/2b/61/36/2b613672e6a75bedba78965c4d58ba51.jpg',
            },
        }

        
        const infoembed = {
            title: '・\`🦎\` , US ',
            description: `;; \`🍙\` own - <@${message.guild.ownerId}> ;; \`10.10.22\` \n ❱❱ ⋮ \`☁️\` ❜ community & safe place \n\n ⪩﹒**fr** & **eng**`,
        };
        
        message.channel.send({ embeds: [embed, infoembed] });
    },
};