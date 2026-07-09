const mongoose = require('mongoose');

const PollutionDataSchema = new mongoose.Schema({
    lat: Number,
    lng: Number,
    aqi: Number,
    pm25: Number,
    timestamp: Date
});

module.exports = mongoose.model('PollutionData', PollutionDataSchema);