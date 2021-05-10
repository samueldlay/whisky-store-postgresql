var logResponse = function (req, res, next) {
    res.on('finish', function () {
        console.log('Params: ', req.params);
        console.log('Query: ', req.query);
        console.log("Responded with status " + res.statusCode);
    });
    next();
};
module.exports = { logResponse: logResponse };
