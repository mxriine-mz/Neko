require('dotenv').config()
const Logger = require('../../Loaders/Logger');

module.exports = {
    name: 'ready',
    once: true,

    async execute(client) {
        Logger.client('- prêt à être utilisé');

        client.application.commands.set(client.commands.map(cmd => cmd));

        const guild = await client.guilds.cache.get(process.env.GUILD_ID);

        setInterval(() => {
            const memberCount = guild.memberCount;
            const memberCountChannel = guild.channels.cache.get(process.env.MEMBER_COUNT_CHANNEL_ID);
            memberCountChannel.setName(`Members : ${memberCount}꒷ₓₒ`);
        }, 10000);

    },
};