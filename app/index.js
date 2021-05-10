"use strict";
exports.__esModule = true;
var express = require('express');
var fs = require('fs');
var helmet = require('helmet');
var lib = require('./middleware');
var helpers = require('./helpers');
var bodyParser = require('body-parser');
var cors = require('cors');
var pool = require('./config').pool;
var app = express();
var PORT = process.env.PORT || 3000;
var whiskys = express.Router();
app.use('/whiskys', whiskys);
app.use(helmet());
app.use(lib.logResponse);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
whiskys.use(lib.logResponse);
app.get('/', function (req, res) {
    res.send('Welcome to the Whiskey Store. Navigate to \'/whiskys\' to view the current JSON data.');
});
whiskys.get('/', function (req, res) {
    pool.query('SELECT * FROM whiskys', function (error, results) {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});
whiskys.get('/:type', function (req, res) {
    var type = req.params.type;
    pool.query('SELECT * FROM whiskys WHERE type = ($1)', [type], function (error, results) {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});
// whiskys.put('/:type', (req: {query: any; params: {type: string;};}, res: {status: (arg0: number) => {(): any; new(): any; send: {(arg0: string): any; new(): any;};};}) => {
//   const updatedType = req.query;
//   fs.readFile('./store.json', (err: any, data: string) => {
//     if (err) console.log(err);
//     const parsedData = JSON.parse(data);
//     const foundType = Object.keys(parsedData.whiskys).find(type => req.params.type === type);
//     if (foundType) {
//       const foundName = parsedData.whiskys[foundType].indexOf(updatedType.name);
//       if (foundName !== -1) {
//         parsedData.whiskys[foundType][foundName] = updatedType.update;
//         const stringified = JSON.stringify(parsedData, null, 2);
//         return helpers.writeNewJson(req, res, stringified);
//       }
//       else return res.status(404).send('That whiskey name does not exist');
//     }
//     else return res.status(404).send('That type of whisky does not exist');
//   });
// });
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
