const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const lib = require('./middleware');
const helpers = require('./helpers');
const bodyParser = require('body-parser')
const cors = require('cors')
const {pool} = require('./config')
import {MiddlewareFn} from './my-types'


const app = express();
const PORT = process.env.PORT || 3000;

const whiskys = express.Router();

app.use('/whiskys', whiskys);

app.use(helmet());

app.use(lib.logResponse);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());


whiskys.use(lib.logResponse);

app.get('/', (req: any, res: {send: (arg0: string) => void;}) => {
  res.send('Welcome to the Whiskey Store. Navigate to \'/whiskys\' to view the current JSON data.');
});

whiskys.get('/', <MiddlewareFn>function(req, res) {
  pool.query('SELECT * FROM whiskys', (error: any, results: {rows: any;}) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

whiskys.get('/:type', <MiddlewareFn>function(req, res) {

  const type = req.params.type;

  pool.query('SELECT * FROM whiskys WHERE type = ($1)', [type], (error: any, results: {rows: any;}) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
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

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
