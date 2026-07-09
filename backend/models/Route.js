const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
    userId: String,
    startLocation: {
        lat: Number,
        lng: Number
    },
    endLocation: {
        lat: Number,
        lng: Number
    },
    preferences: {
        email: String,
        phone: String,
        notifyWhenClean: Boolean
    },
    lastScore: Number
});

module.exports = mongoose.model('Route', RouteSchema);