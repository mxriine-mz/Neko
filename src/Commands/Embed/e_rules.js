const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'e_rules',
    category: 'embed',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: true,
    usage: 'e_rules',
    examples: ['e_rules'],
    description: 'Envoie un embed avec les règles',

    run: async (client, message, args, guildSettings, userSettings) => {

        const rulesembed = {
            title: '・RULES',
            description: `・Appliqué les [tos](https://discord.com/terms) & [guild](https://discord.com/guidelines)`+
            `\n・**Ne pas** divulguer d'information sur \`vous-même\` \n ou sur \`d'autre personnes\`・`+
            `\n・Ne pas créer \`d'atmosphère toxique\` *!*`+
            `\n・__Respecter__ tout les membres *!*`+
            `\n・Pas d'homophobie de racisme *etc*... `+
            `\n ➜ **Ne pas** se promouvoir soi-même`,

            image: {
                url: 'https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png',
            },
        }
        
        const channelembed = {
            title: 'CHANNELS .',
            description: `・fr & eng server *!*`+
            `\n・**Ne pas** utiliser d'autres langagues que le *français* ou *l'anglais* !`+
            `\n・Conserver un surnom **mentionnable** ! , ⁺`+
            `\n・__Respecter__ les **sujets** des channels *!!*`+
            `\n・Les __messages__ **nsfw** ou __pfp__ **ne sont pas** autorisés. \n *!* __sauf si salon dédié__ *!*`,

            image: {
                url: 'https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png',
            },
        }

        const warnembed = {
            title: '⪩ WARNS ─',
            description: `・\`2.0\` **warns** 、__mute__`+ 
            `\n・\`3.0\` **warns**﹐ __temp kick__`+
            `\n・\`4.0\` **warns** ﹑ __ban__ !`,

            image: {
                url: 'https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png',
            },
        };
        
        message.channel.send({ embeds: [rulesembed, channelembed, warnembed] });
        message.delete();
    },
};