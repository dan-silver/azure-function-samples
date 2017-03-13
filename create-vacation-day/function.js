"use strict";
function main(context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    var res;
    if (req.query.name || (req.body && req.body.name)) {
        res = {
            // status: 200, /* Defaults to 200 */
            body: "[vacation-day-1] Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    context.done(null, res);
}
exports.main = main;
;
