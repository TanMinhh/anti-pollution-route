const calculateRouteScore = (routeData, historicalData) => {
    let baseScore = 100;

    const currentAQI = routeData.aqi;
    baseScore -= (currentAQI * 10);

    const historicalAvg = historicalData.reduce((acc, curr) => acc + curr.aqi, 0) / historicalData.length;

    if (currentAQI < historicalAvg) {
        baseScore += 15;
    }

    return Math.max(0, baseScore);
};

module.exports = { calculateRouteScore };