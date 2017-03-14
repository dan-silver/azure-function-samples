import { OpenWeatherMapAppId } from '../secrets'
import fetch from 'node-fetch';
import { GraphClient } from '../authHelpers';

export async function main (context, req) {
    const isNiceWeatherDay = await isNiceWeather("seattle");
    // if (isNiceWeather) {
        tellCoworkers();
    // }
    let response = {
        status: 200, // optional, defaults to 200
        body: isNiceWeatherDay
    };
    return response;
};

async function isNiceWeather(city:string) {
    const weatherRawResponse = await fetch(`http://localhost:7071/api/check-weather?city=${city}`);
    const weatherData = await weatherRawResponse.json();

    const temp = weatherData.main.temp;
    return temp > 31 && temp < 33 // (88 to 92 deg)
}

async function tellCoworkers() {
    const client = await GraphClient();

    let coworkerEmails = await client.api("/me/people").version("beta").get().then((response) => {
        return response.value.map((p) => { return {emailAddress: {address:p.emailAddresses[0].address}}})
    });

    return client.api("/me/sendMail")
        .post({message: {
            subject: "I'm out today, nice weather!",
            toRecipients: coworkerEmails,
            body: {
                content: "Isn't the weather nice?"
            }
        }});
}