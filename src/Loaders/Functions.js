const { Guild, User } = require("../Models");
const Logger = require("./Logger");

module.exports = (client) => {
    // ——————————————————————————————————————
    // GUILDS
    // ——————————————————————————————————————

    client.getGuild = async (guild) => {
        try {
            return await Guild.findOne({ id: guild.id });
        } catch (err) {
            console.error("[DB] Erreur getGuild :", err);
            return null;
        }
    };

    client.createGuild = async (guild) => {
        try {
            const exists = await client.getGuild(guild);
            if (exists) return exists;

            const newGuild = new Guild({
                id: guild.id,
                name: guild.name,
            });

            await newGuild.save();
            Logger.client(` Nouveau serveur créé : ${guild.name} (${guild.id})`);
            return newGuild;

        } catch (err) {
            console.error("[DB] Erreur createGuild :", err);
            return null;
        }
    };

    client.updateGuild = async (guild, settings) => {
        try {
            const guildData = await client.getGuild(guild);

            if (!guildData) {
                // Si la guild n'existe pas en DB, on la crée
                return await client.createGuild(guild);
            }

            await Guild.updateOne({ id: guild.id }, { $set: settings });
            return await client.getGuild(guild);

        } catch (err) {
            console.error("[DB] Erreur updateGuild :", err);
            return null;
        }
    };

    // ——————————————————————————————————————
    // USERS
    // ——————————————————————————————————————

    client.getUser = async (user) => {
        try {
            return await User.findOne({ id: user.id });
        } catch (err) {
            console.error("[DB] Erreur getUser :", err);
            return null;
        }
    };

    client.createUser = async (user) => {
        try {
            const exists = await client.getUser(user);
            if (exists) return exists;

            const newUser = new User({
                id: user.id,
                user: user.tag,
                createdAt: user.createdAt.toISOString(),
            });

            await newUser.save();
            Logger.client(` Nouvel utilisateur ajouté : ${user.tag} (${user.id})`);
            return newUser;

        } catch (err) {
            console.error("[DB] Erreur createUser :", err);
            return null;
        }
    };

    client.updateUser = async (user, settings) => {
        try {
            const userData = await client.getUser(user);

            if (!userData) {
                // Auto création si nécessaire
                return await client.createUser(user);
            }

            await User.updateOne({ id: user.id }, { $set: settings });
            return await client.getUser(user);

        } catch (err) {
            console.error("[DB] Erreur updateUser :", err);
            return null;
        }
    };
};
