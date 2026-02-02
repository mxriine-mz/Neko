const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    id: String,
    name: String,

    prefix: { type: String, default: process.env.PREFIX },

    // —————————————————————————
    // LOGS
    // —————————————————————————
    logs: {
        enabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
        types: {
            messages: { type: Boolean, default: false },
            moderation: { type: Boolean, default: false },
            joins: { type: Boolean, default: false },
            leaves: { type: Boolean, default: false },
            roles: { type: Boolean, default: false },
            channels: { type: Boolean, default: false },
            bans: { type: Boolean, default: false },
            boosts: { type: Boolean, default: false }
        }
    },

    // —————————————————————————
    // WELCOME
    // —————————————————————————
    welcome: {
        enabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
        message: { type: String, default: "Bienvenue {user} 👋" },
        image: { type: String, default: null }
    },

    // —————————————————————————
    // BYE
    // —————————————————————————
    bye: {
        enabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
        message: { type: String, default: "{user} nous a quitté… 😢" },
        image: { type: String, default: null }
    },

    // —————————————————————————
    // ANNONCES
    // —————————————————————————
    annonces: {
        enabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
        ping: { type: String, default: "none" }, // none | here | everyone | roleID
        embed: { type: Boolean, default: true },
    },

    // —————————————————————————
    // AUTOROLE
    // —————————————————————————
    autorole: {
        enabled: { type: Boolean, default: false },
        role: { type: String, default: null }
    },

    // —————————————————————————
    // STARBOARD
    // —————————————————————————
    starboard: {
        enabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
        threshold: { type: Number, default: 3 }
    },

    // —————————————————————————
    // TICKETS
    // —————————————————————————
    tickets: {
        enabled: { type: Boolean, default: false },
        category: { type: String, default: null },
        staffRole: { type: String, default: null },
        transcript: { type: Boolean, default: false },
        logsChannel: { type: String, default: null }
    }

});

module.exports = mongoose.model('Guild', guildSchema);
