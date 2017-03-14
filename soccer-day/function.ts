import { Url, parse } from 'url'
import { OpenWeatherMapAppId } from '../secrets'
import fetch from 'node-fetch';
import { GraphClient } from '../authHelpers';

export async function main (context, req) {
    let requestUrl = parse(req.originalUrl);

    const isNiceWeatherDay = await isNiceWeather(requestUrl, "seattle");
    if (isNiceWeather) {
        tellCoworkers();
    }
    let response = {
        status: 200, // optional, defaults to 200
        body: isNiceWeatherDay
    };
    return response;
};

async function isNiceWeather(requestUrl:Url, city:string) {
    const weatherRawResponse = await fetch(`${requestUrl.protocol}//${requestUrl.host}/api/check-weather?city=${city}`);
    const weatherData = await weatherRawResponse.json();

    const temp = weatherData.main.temp;
    return temp > 31 && temp < 33 // (88 to 92 deg)
}

async function tellCoworkers() {
    const client = await GraphClient();

    // get the email addresses of the people I interact with the most across email, files, shared notes, etc.
    const coworkerEmails = await client.api("/me/people").version("beta").get().then((res) => {
        return res.value.map((p) => { return {emailAddress: {address:p.emailAddresses[0].address}}})
    });

    // email that list of people
    return client.api("/me/sendMail").post({
        message: {
            subject: "Soccer after work today?",
            toRecipients: coworkerEmails,
            body: {
                content: "Soccer after work today? The weather is great!"
            }
        }
    });
}