// import { OpenWeatherMapAppId } from '../secrets'
// import fetch from 'node-fetch';

export function main (context, req) {
    console.log('a1')

    context.done(null, {body:{a:1}});
// return;
    // getWeatherForecast(req.query.city).then((weatherData) => {
    //     console.log('a2')
    //     let response = {
    //         status: 200, // optional, defaults to 200
    //         body: weatherData
    //     };
    //     context.done(null, response);
    // }).catch((error) => {
    //     console.log('a3')

    //     // try passing error as first param

    //     context.done(null, {
    //         status: 500,
    //         body: {error1: error}
    //     });
    // })
};

// async function getWeatherForecast(cityName:string):Promise<any> {
//     if (typeof cityName === "undefined") {
//         return Promise.reject("city not passed");
//     }

//     let rawRes = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&mode=json&APPID=${OpenWeatherMapAppId}`);
//     let weatherObj =  await rawRes.json();
//     return weatherObj.list[0];
// }