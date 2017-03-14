"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const url_1 = require("url");
const node_fetch_1 = require("node-fetch");
const authHelpers_1 = require("../authHelpers");
function main(context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestUrl = url_1.parse(req.originalUrl);
        const isNiceWeatherDay = yield isNiceWeather(requestUrl, "seattle");
        if (isNiceWeather) {
            tellCoworkers();
        }
        let response = {
            status: 200,
            body: isNiceWeatherDay
        };
        return response;
    });
}
exports.main = main;
;
function isNiceWeather(requestUrl, city) {
    return __awaiter(this, void 0, void 0, function* () {
        const weatherRawResponse = yield node_fetch_1.default(`${requestUrl.protocol}//${requestUrl.host}/api/check-weather?city=${city}`);
        const weatherData = yield weatherRawResponse.json();
        const temp = weatherData.main.temp;
        return temp > 31 && temp < 33; // (88 to 92 deg)
    });
}
function tellCoworkers() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield authHelpers_1.GraphClient();
        // get the email addresses of the people I interact with the most across email, files, shared notes, etc.
        const coworkerEmails = yield client.api("/me/people").version("beta").get().then((res) => {
            return res.value.map((p) => { return { emailAddress: { address: p.emailAddresses[0].address } }; });
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
    });
}
