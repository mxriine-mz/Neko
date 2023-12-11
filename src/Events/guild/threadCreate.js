require('dotenv').config()

module.exports = {
    name: 'threadCreate',
    once: false,

    async execute(client, thread) {

        if (thread.isTextBased()) thread.join();

        const logChannel = client.channels.cache.get(process.env.LOG_ID);
        logChannel.send(`Nom du thread : ${thread.name}`);
       
    },
};