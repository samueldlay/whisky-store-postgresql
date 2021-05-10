"use strict";
exports.__esModule = true;
var fs = require('fs');
var writeNewJson = function (req, res, data) {
    fs.writeFile('app/store.json', data, function (err) {
        if (err)
            console.log(err);
        res.status(201).send(data);
    });
};
module.exports = { writeNewJson: writeNewJson };
