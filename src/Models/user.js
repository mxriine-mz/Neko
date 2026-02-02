const mongoose = require('mongoose');

require('dotenv').config()

const userSchema = mongoose.Schema({
    id: String,
    user: String,
    createdAt: { 'type': String },
    birthday: { 'type': String, 'default': null },
    ticket: { 'type': Boolean, 'default': false },
    ticketMessageId: { 'type': String, 'default': null  },
    level: { 'type': Number, 'default': 0 },
    nextNiveau: { 'type': Number, 'default': 300 },
    xp: { 'type': Number, 'default': 0 },
    rank : { 'type' : String, 'default': null },
    inGuild : { 'type': Boolean, 'default': false },
    leftAt: { 'type': String, 'default': null },
    warnings: {
        type: [
            {
                reason: { type: String, required: true },
                date: { type: Date, default: Date.now },
                moderator: { type: String, required: true }
            }
        ],
        default: []
    }
});

module.exports = mongoose.model('User', userSchema);