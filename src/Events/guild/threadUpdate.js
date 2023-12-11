require('dotenv').config()

module.exports = {
    name: 'threadCreate',
    once: false,

    async execute(client, oldThread, newThread) {

        if (oldThread.archived && !newThread.archived) thread.join();

        const logChannel = client.channels.cache.get(process.env.LOG_ID);
        logChannel.send(`Nom du thread : ${thread.name}`);
       
    },
};