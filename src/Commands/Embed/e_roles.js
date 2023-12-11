const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'e_roles',
    category: 'embed',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: true,
    usage: 'e_roles',
    examples: ['e_roles'],
    description: 'Envoie un embed avec les roles',

    run: async (client, message, args, guildSettings, userSettings) => {

        const embed = {
            image: {
                url: 'https://i.pinimg.com/originals/9e/c9/1e/9ec91eeaeab7d5ecec1f93d39f3c285d.jpg',
            },
        }

        const genresembed = {
            description: `001・<@&${process.env.ROLES_GIRL_ID}>・`+
            `002・<@&${process.env.ROLES_BOY_ID}>・`+
            `003・<@&${process.env.ROLES_NONBINARY_ID}>`,

            image: {
                url: 'https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png',
            },
        }
        
        const ageembed = {
            description:`001・<@&${process.env.ROLES_MINOR_ID}>・`+
            `002・<@&${process.env.ROLES_MAJOR_ID}>`,

            image: {
                url: 'https://cdn.discordapp.com/attachments/1062345825004572743/1097994372638855318/Capture_decran_2023-04-18_231656.png',
            },
        }
        
       //envoyer l'embed des genres
        const genresembedmsg = await message.channel.send({ embeds: [genresembed] });
        await genresembedmsg.react('<:1_one:1100681540008165396>');
        await genresembedmsg.react('<:2_two:1100681548090593331>');
        await genresembedmsg.react('<:3_three:1100681546962309192>');

            
        //envoyer l'embed des ages
        const ageembedmsg = await message.channel.send({ embeds: [ageembed] });
        await ageembedmsg.react('<:1_one:1100681540008165396>');
        await ageembedmsg.react('<:2_two:1100681548090593331>');
        


        message.delete();
    },

    //<:1_one:1100681540008165396>
    //<:2_two:1100681548090593331>
    //<:3_three:1100681546962309192> 
    //<:a4_numbers:1090251646526816266> 
    //<:a5_numbers:1090251643376898138> 
    //<:a6_numbers:1090251638238887986>
};