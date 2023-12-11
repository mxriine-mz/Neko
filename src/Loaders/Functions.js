const { Guild } = require("../Models");
const { User } = require("../Models");
const Logger = require('./Logger');

module.exports = client => {

    client.getGuild = async guild => {
        const guildData = await Guild.findOne({
            id: guild.id
        });
        return guildData;
    };

    client.createGuild = async guild => {
        const createGuild = new Guild({
            id: guild.id,
            name: guild.name,
        });
        createGuild.save().then(g => Logger.client(`Nouveau serveur (${g.id})`));
    }

    client.updateGuild = async (guild, settings) => {
        let guildData = await client.getGuild(guild);
        if (typeof guildData != "object") guildData = {};
        for (const key in settings) {
            if (guildData[key] != settings[key]) guildData[key] = settings[key];
        }
        return guildData.updateOne(settings);
    }

    client.getUser = async user => {
        const userData = await User.findOne({
            id: user.id
        });
        return userData;
    };

    client.createUser = async (user) => {
        const createUser = await new User({
            id: user.id,
            user: user.tag,
            createdAt: user.createdAt.toLocaleDateString(),
        });
        createUser.save().then(u => Logger.client(`Nouvel utilisateur : ${u.user} (${u.id})`));
    };

    client.updateUser = async (user, settings) => {
        let userData = await client.getUser(user);
        if (typeof userData != "object") userData = {};
        for (const key in settings) {
            if (userData[key] != settings[key]) userData[key] = settings[key];
        }
        return userData.updateOne(settings);
    };

};