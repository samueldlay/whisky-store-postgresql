"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
var express = require('express');
var helmet = require('helmet');
var lib = require('./middleware');
var cors = require('cors');
var _a = require('./config'), client = _a.client, pool = _a.pool;
// client.connect();
// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err: any, res: {rows: any}) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });
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
whiskys.use(cors());
app.get('/', function (req, res) {
    res.send('Welcome to the Whiskey Store. Navigate to \'/whiskys\' to view the current JSON data.');
});
app.get('/db', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var client_1, result, results, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    client_1 = _a.sent();
                    return [4 /*yield*/, client_1.query('SELECT * FROM whiskys')];
                case 2:
                    result = _a.sent();
                    results = { 'results': (result) ? result.rows : null };
                    res.render('pages/db', results);
                    client_1.release();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error(err_1);
                    res.send("Error " + err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
whiskys.get('/', function (req, res) {
    pool.query('SELECT * FROM whiskys ORDER BY id ASC', function (error, results) {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});
whiskys.post('/', function (req, res) {
    var type = req.body.type;
    pool.query('SELECT * FROM whiskys WHERE type = ($1)', [type], function (error, results) {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(results.rows);
    });
});
whiskys.post('/id', function (req, res) {
    var id = req.body.id;
    pool.query('SELECT * FROM whiskys WHERE id = ($1)', [id], function (error, results) {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(results.rows);
    });
});
whiskys.post('/update', function (req, res) {
    var body = req.body;
    var bodyVals = Object.values(body);
    var bodyKeys = Object.keys(body);
    var valuesWithID = Array.from(new Set(__spreadArray(__spreadArray([], bodyVals), [body.id])));
    var keysWithID = Array.from(new Set(__spreadArray(__spreadArray([], bodyKeys), [body.id])));
    var mapKeysToQuery = keysWithID.map(function (prop, index) {
        if (index < keysWithID.length)
            return "WHERE id = $" + (index + 1) + ";";
        else if (index === keysWithID.length - 2)
            return prop + " = $" + (index + 1);
        return prop + " = $" + (index + 1) + ",";
    });
    var joinedQueries = "UPDATE whiskys SET " + mapKeysToQuery.join(' ');
    // const query = `UPDATE whiskys SET WHERE id = ${valuesWithID[valuesWithID.length - 1]}`;
    // for (const property in body) {
    // }
    // pool.query(joinedQueries, bodyVals, (error: any, results: {rows: any;}) => {
    //   if (error) {
    //     return res.status(500).send(error);
    //   }
    //   res.status(200).json(results.rows);
    // })
    // pool.query('SELECT * FROM whiskys WHERE id = ($1)', [id], (error: any, results: {rows: any;}) => {
    //   if (error) {
    //     return res.status(500).send(error);
    //   }
    //   res.status(200).json(results.rows);
    // })
    res.status(200).send(joinedQueries);
});
whiskys.post('/add', function (req, res) {
    var updatedType = req.body;
    var _a = req.body, type = _a.type, name = _a.name;
    var value = req.body.value;
    console.log('UPDATED:', updatedType);
    pool.query('INSERT INTO whiskys (type, value, name) values ($1, $2, $3)', [type, value, name], function (error, results) {
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
