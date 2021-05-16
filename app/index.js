"use strict";
exports.__esModule = true;
var express = require('express');
var fs = require('fs');
var helmet = require('helmet');
var lib = require('./middleware');
var helpers = require('./helpers');
var bodyParser = require('body-parser');
var cors = require('cors');
var _a = require('./config'), pool = _a.pool, client = _a.client;
client.connect();
var app = express();
var PORT = process.env.PORT || 3000;
var whiskys = express.Router();
app.use('/whiskys', whiskys);
app.use(helmet());
app.use(lib.logResponse);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
whiskys.use(lib.logResponse);
whiskys.use(express.json());
whiskys.use(express.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    res.send('Welcome to the Whiskey Store. Navigate to \'/whiskys\' to view the current JSON data.');
});
whiskys.get('/', function (req, res) {
    client.query('SELECT * FROM whiskys', function (error, results) {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});
whiskys.post('/', function (req, res) {
    var type = req.body.type;
    client.query('SELECT * FROM whiskys WHERE type = ($1)', [type], function (error, results) {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(results.rows);
    });
});
whiskys.post('/add', function (req, res) {
    var updatedType = req.body;
    var _a = req.body, type = _a.type, name = _a.name;
    var value = req.body.value;
    console.log('UPDATED:', updatedType);
    client.query('INSERT INTO whiskys (type, value, name) values ($1, $2, $3)', [type, value, name], function (error, results) {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json({ status: 'success', message: 'Whisky added.' });
    });
});
// whiskys.post('/', (req: {query: any;}, res: {status: (arg0: number) => {(): any; new(): any; send: {(arg0: string | undefined): void; new(): any;};};}) => {
//   const newWhiskey = req.query;
//   const validQuery = Object.keys(newWhiskey).includes('type') && Object.keys(newWhiskey).includes('name');
//   if (validQuery) {
//     fs.readFile('./store.json', (err: any, data: string) => {
//       if (err) console.log(err);
//       const parsedData = JSON.parse(data);
//       if (typeof newWhiskey.name === 'object') parsedData.whiskys[newWhiskey.type] = [...parsedData.whiskys[newWhiskey.type],...newWhiskey.name];
//       else if (typeof newWhiskey.name === 'string') parsedData.whiskys[newWhiskey.type] = [...parsedData.whiskys[newWhiskey.type], newWhiskey.name];
//       else return res.status(500).send('Invalid parameters');
//       const stringified = JSON.stringify(parsedData, null, 2);
//       helpers.writeNewJson(req, res, stringified);
//     });
//   }
//   else res.status(500).send('Not valid parameters');
// });
// whiskys.delete('/:type', (req: {params: {type: string;}; query: {name: any;};}, res: {status: (arg0: number) => {(): any; new(): any; send: {(arg0: string): any; new(): any;};};}) => {
//   fs.readFile('./store.json', (err: any, data: string) => {
//     if (err) console.log(err);
//     const parsedData = JSON.parse(data);
//     const foundType = Object.keys(parsedData.whiskys).indexOf(req.params.type);
//     if (foundType !== -1) parsedData.whiskys[req.params.type].splice(req.query.name, 1);
//     else return res.status(404).send('That type of whisky does not exist');
//     const stringified = JSON.stringify(parsedData, null, 2);
//     helpers.writeNewJson(req, res, stringified);
//   });
// });
app.listen(PORT, function () { return console.log("listening on port " + PORT); });
