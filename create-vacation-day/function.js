"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const node_fetch_1 = require("node-fetch");
const authHelpers_1 = require("../authHelpers");
function main(context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const isNiceWeatherDay = yield isNiceWeather("seattle");
        // if (isNiceWeather) {
        tellCoworkers().then(() => {
            console.log(true);
        }).catch((e) => {
            console.log(false, e);
        });
        // }
        let response = {
            status: 200,
            body: isNiceWeatherDay
        };
        return response;
        // context.done(null, response);
    });
}
exports.main = main;
;
function isNiceWeather(city) {
    return __awaiter(this, void 0, void 0, function* () {
        const weatherRawResponse = yield node_fetch_1.default(`http://localhost:7071/api/check-weather?city=${city}`);
        const weatherData = yield weatherRawResponse.json();
        const temp = weatherData.main.temp;
        return temp > 31 && temp < 33; // (88 to 92 deg)
    });
}
function tellCoworkers() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield authHelpers_1.GraphClient();
        let coworkerEmails = yield client.api("/me/people").version("beta").get().then((response) => {
            return response.value.map((p) => { return { emailAddress: { address: p.emailAddresses[0].address } }; });
        });
        console.log(coworkerEmails);
        client.api("/me/sendMail")
            .post({ message: {
                subject: "I'm out today, nice weather!",
                toRecipients: coworkerEmails,
                body: {
                    content: "Isn't the weather nice?"
                }
            } }, (err, res, rawRes) => {
            console.log("err", err);
        });
    });
}
