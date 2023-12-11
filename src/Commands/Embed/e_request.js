const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'e_request',
    category: 'embed',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: true,
    usage: 'e_request',
    examples: ['e_request'],
    description: 'Envoie un embed avec des informations',

    run: async (client, message, args, guildSettings, userSettings) => {
        
        const postuembed = {
            title: '・**POSTULER** ',
            description: `・Vous souhaitez rejoindre notre équipe ? pas de problème, \n` +
            ` voici quelques informations !
            l__**i**r__e et **p**__ostuler__﹒\n\n` +
            `・Si vous avez des questions, veuillez ouvrir un ticket en allant dans <#1100689614102081536>`,

            image: {
                url: 'https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png',
            },
        };

        const infoembed = {
            title: '・LES RÈGLES',
            description: `>>> Travailler dans un environnement à la fois professionnel et convivial.\n`+
            `Bénéficier d'avantages et de contenus exclusifs pour le personnel.\n`+
            `Maintenir la paix au sein de notre communauté.\n`+
            `Nous aider à créer de nouvelles et meilleures fonctionnalités.\n`,

            image: {
                url: 'https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png',
            },
        };

        const lienuembed = {
            title: '⪩ LIEN',
            description: `Lvl *10* **minimum**, et ne pas avoir de warn ! . troll = ban \n`+
            `<a:vaarrow:1100688357253726299> cliquez [**ici**](https://docs.google.com/forms/d/e/1FAIpQLScg7ooDTceP8APjqmZ7D0aiWXPZg19JH29Kml-JnOwRp4lnRQ/viewform?usp=sf_link) et bonne chance ! !!`,

            image: {
                url: 'https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png',
            },
        };
        
        message.channel.send({ embeds: [postuembed, infoembed, lienuembed] });
        message.delete();
    },
};