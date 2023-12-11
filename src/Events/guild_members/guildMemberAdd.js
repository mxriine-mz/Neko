require('dotenv').config()

module.exports = {
    name: 'guildMemberAdd',
    once: false,

    async execute(client, member) {

        await client.createUser(member.user);

        const fetchGuild = await client.getGuild(member.guild);
        const guild = member.guild;

        if(fetchGuild.announce == true) {

        const announceChannel = client.channels.cache.get(fetchGuild.announceChannel);
        announceChannel.send({content : `➜ Welcome to **${guild.name}**, <@${member.user.id}>!`});

        }

        if(fetchGuild.logs == true) {

            const logembed = {
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
                    text: 'L\'utilisateur a rejoint le serveur',
                    icon_url: member.user.displayAvatarURL({ dynamic: true }),
                },
            }

            const logChannel = client.channels.cache.get(fetchGuild.logsChannel);
            logChannel.send({ embeds: [ logembed ]});

        }

        if (member.user.bot) {
            member.roles.add(process.env.BOT_ROLE_ID);
        }

        if (guild === process.env.GUILD_ID) {
            member.roles.add(process.env.ROLE_ID);
        }
       
    },
};