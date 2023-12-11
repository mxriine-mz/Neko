require('dotenv').config()

module.exports = {
    name: 'guildMemberRemove',
    once: false,

    async execute(client, member) {

        const fetchGuild = await client.getGuild(member.guild);
        const guild = member.guild;

        if(fetchGuild.announce == true) {

            const welcyChannel = client.channels.cache.get(fetchGuild.announceChannel);
            welcyChannel.send({content : `➜ <@${member.user.id}> à quitté **${guild.name}** *!*`});
    
        }

        if(fetchGuild.logs == true) {

            const embed = {
                color: 0x202225,
                author: {
                    name: `${member.user.tag}`,
                    icon_url: member.user.displayAvatarURL({ dynamic: true }),
                },
                description: `
                **± Nom d'utilisateur:** ${member.displayName}
                **± ID:** ${member.user.id}
                **± Crée le:** <t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)
                **± Rejoint le:** <t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`,

                timestamp: new Date(),
                footer: {
                    text: 'L\'utilisateur a quitté le serveur',
                    icon_url: member.user.displayAvatarURL({ dynamic: true }),
                },
            }      

            const logChannel = client.channels.cache.get(process.env.LOG_ID);
            logChannel.send({ embeds: [ embed ]});
        }
       
    },
};