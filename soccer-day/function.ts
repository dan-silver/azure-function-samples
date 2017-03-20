import { Url, parse } from 'url'
import { OpenWeatherMapAppId, CheckWeatherAppKey } from '../secrets'
import fetch from 'node-fetch';
import { GraphClient } from '../authHelpers';

export async function main (context, req) {
    context.log("starting soccer-day function!");
    let requestUrl = parse(req.originalUrl);

    const isNiceWeatherDay = await isNiceWeather(context, requestUrl, "seattle");

    let coworkerEmails;
    if (isNiceWeather) {
        
        coworkerEmails = await getCoworkers();
        tellCoworkers(coworkerEmails);
    }
    let response = {
        status: 200, // optional, defaults to 200
        body: {
            coworkerEmails,
            isNiceWeatherDay
        }
    };
    return response;
};

async function isNiceWeather(context, requestUrl:Url, city:string) {
    const weatherFunctionUrl = `${requestUrl.protocol}//${requestUrl.host}/api/check-weather?city=${city}&code=${CheckWeatherAppKey}`;
    context.log("weatherFunctionUrl", weatherFunctionUrl);
    const weatherRawResponse = await fetch(weatherFunctionUrl);
    const weatherData = await weatherRawResponse.json();

    const temp = weatherData.main.temp;
    return temp > 31 && temp < 33 // (88 to 92 deg)
}


async function getCoworkers() {
    const client = await GraphClient();

    // get the email addresses of the people I interact with the most across email, files, shared notes, etc.
    return await client.api("/me/people").version("beta").get().then((res) => {
        return res.value.map((p) => { return {emailAddress: {address:p.emailAddresses[0].address}}})
    });
}

async function tellCoworkers(coworkerEmails) {
    const client = await GraphClient();

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