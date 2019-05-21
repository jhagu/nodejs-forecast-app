const request = require('request');

const forecast = (latitude, longitude, callback) => {

    const url = `https://api.darksky.net/forecast/ac9b10f7deec6fd446325757085737c1/${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}?units=si`;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service', undefined);
        } else if (body.error) {
            callback('Unable to find location', undefined);
        } else {
            const summary = body.daily.data[0].summary;
            const temperature = body.currently.temperature;
            const precipProbability = body.currently.precipProbability * 100;
            callback(
                undefined,
                `${summary} It is currently ${temperature} degrees out. There is a ${precipProbability}% chance to rain.`
            );
        }
    });
}

module.exports = forecast;