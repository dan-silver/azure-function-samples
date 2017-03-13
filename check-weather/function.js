"use strict";
const secrets_1 = require("./secrets");
const node_fetch_1 = require("node-fetch");
function main(context, req) {
    getWeatherForecast(req.query.city).then((weatherData) => {
        let response = {
            status: 200,
            body: JSON.stringify(weatherData)
        };
        context.done(null, response);
    }).catch((error) => {
        // try passing error as first param
        context.done(null, {
            status: 500,
            body: { error }
        });
    });
}
exports.main = main;
;
function getWeatherForecast(cityName) {
    if (typeof cityName === "undefined") {
        return Promise.reject("city not passed");
    }
    return node_fetch_1.default(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&mode=json&APPID=${secrets_1.OpenWeatherMapAppId}`);
}
