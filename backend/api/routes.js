const express = require('express');
const Route = require('../models/Route');
const PollutionData = require('../models/PollutionData');
const { fetchPollutionData } = require('../services/fetchData');
const { calculateRouteScore } = require('../services/scoreEngine');
const router = express.Router();

router.post('/route', async (req, res) => {
    const newRoute = new Route(req.body);
    await newRoute.save();
    res.status(201).json(newRoute);
});

router.get('/route/:userId', async (req, res) => {
    const userRoutes = await Route.find({ userId: req.params.userId });
    res.json(userRoutes);
});

router.get('/score', async (req, res) => {
    const { lat, lng } = req.query;
    const data = await fetchPollutionData(lat, lng);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const historicalData = await PollutionData.find({
        lat,
        lng,
        timestamp: { $gte: oneWeekAgo }
    });

    const score = calculateRouteScore(data, historicalData);
    res.json({ score });
});

module.exports = router;