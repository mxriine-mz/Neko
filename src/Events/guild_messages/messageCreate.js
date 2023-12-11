require('dotenv').config()

module.exports = {
    name: 'messageCreate',
    once: false,

    async execute(client, message) {

        if (message.author.bot) return;

        let guildSettings = await client.getGuild(message.guild);

        if (!guildSettings) {
            await client.createGuild(message.guild);
            guildSettings = await client.getGuild(message.guild);
            return message.reply(`J'ai mis à jour la base de données pour votre serveur. Veuillez retaper la commande !`);
        }

        let userSettings = await client.getUser(message.author);

        if(userSettings) {

            let xpAdd = Math.floor(Math.random() * 7) + 8;

            if (userSettings.xp >= userSettings.nextNiveau) {
                userSettings.level += 1;
                userSettings.nextNiveau = userSettings.nextNiveau * 2;
    
                userSettings.save();
    
                message.channel.send(`Bravo ${message.author}, tu es passé niveau ${userSettings.level} !`);
            } else {
                userSettings.xp += xpAdd;
                userSettings.save();
            }

        } else {
            if (message.author.bot) return;
            
            await client.createUser(message.author);
            userSettings = await client.getUser(message.author);
        }

        if (!message.content.startsWith(guildSettings.prefix)) return;

        const args = message.content.slice(guildSettings.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        if (commandName.length == 0) return;

        let cmd = client.commands.get(commandName);

        if (!cmd) return message.reply(`Cette commande n'existe pas!`); 

        if (cmd.ownerOnly) {
            if (message.author.id !== process.env.OWNER_ID) return message.reply(`Seul le propriétaire du bot peut taper cette commande!`);
        }
 
        if (!message.member.permissions.has([cmd.permissions])) return message.reply(`Vous n'avez pas la/les permissions(s) requise(s) pour taper cette commande!`);

        //crée un système d'xp pour les utilisateurs

        if (cmd) cmd.run(client, message, args, guildSettings, userSettings);
        
    },
};