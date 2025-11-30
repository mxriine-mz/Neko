const mongoose = require('mongoose');

require('dotenv').config()

const userSchema = mongoose.Schema({
    id: String,
    user: String,
    createdAt: { 'type': String },
    birthday: { 'type': String, 'default': null },
    ticket: { 'type': Boolean, 'default': false },
    ticketMessageId: { 'type': String, 'default': null  },
    nextNiveau: { 'type': Number, 'default': 300 },
    level: { 'type': Number, 'default': 0 },
    xp: { 'type': Number, 'default': 0 },
    rank : { 'type' : String, 'default': null },

});

module.exports = mongoose.model('User', userSchema);