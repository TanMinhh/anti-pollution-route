const axios = require('axios');
const PollutionData = require('../models/PollutionData');

const fetchPollutionData = async (lat, lng) => {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${process.env.WEATHER_API_KEY}`;
    const response = await axios.get(url);
    const data = response.data.list[0];

    const record = new PollutionData({
        lat,
        lng,
        aqi: data.main.aqi,
        pm25: data.components.pm2_5,
        timestamp: new Date()
    });
    await record.save();
    return record;
};

module.exports = { fetchPollutionData };