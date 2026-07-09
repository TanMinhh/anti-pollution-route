const cron = require('node-cron');
const Route = require('./models/Route');
const PollutionData = require('./models/PollutionData');
const { fetchPollutionData } = require('./services/fetchData');
const { calculateRouteScore } = require('./services/scoreEngine');
const { sendEmailAlert, sendWhatsAppAlert } = require('./services/notifications');

const startWorker = () => {
    cron.schedule('*/15 * * * *', async () => {
        const routes = await Route.find({ 'preferences.notifyWhenClean': true });
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        for (const route of routes) {
            const data = await fetchPollutionData(route.startLocation.lat, route.startLocation.lng);

            const historicalData = await PollutionData.find({
                lat: route.startLocation.lat,
                lng: route.startLocation.lng,
                timestamp: { $gte: oneWeekAgo }
            });

            const score = calculateRouteScore(data, historicalData);

            if (score > 80 && score > (route.lastScore || 0)) {
                const message = `Your route is currently clear with a score of ${score}. Safe travels!`;

                if (route.preferences.email) {
                    await sendEmailAlert(route.preferences.email, message);
                }
                if (route.preferences.phone) {
                    await sendWhatsAppAlert(route.preferences.phone, message);
                }
            }

            route.lastScore = score;
            await route.save();
        }
    });
};

module.exports = { startWorker };