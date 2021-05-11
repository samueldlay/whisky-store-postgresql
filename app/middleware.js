"use strict";
exports.__esModule = true;
exports.logResponse = void 0;
function logResponse(req, res, next) {
    res.on('finish', function () {
        console.log('Body: ', req.body);
        console.log("Responded with status " + res.statusCode);
    });
    next();
}
exports.logResponse = logResponse;
;
