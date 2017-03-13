import { appId } from './secrets'

export function main (context, req) {
    let res;

    if (req.query.name || (req.body && req.body.name)) {
        res = {
            // status: 200, /* Defaults to 200 */
            body: "[weather-1] Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    context.done(null, res);
};

function getWeatherForecast(cityName:string):Promise<any> {
    if (typeof cityName === "undefined") {
        return Promise.reject("city not passed");
    }

    return fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&mode=json&APPID=${appId}`);
}