const express = require('express');
const helmet = require('helmet');
const lib = require('./middleware');
const cors = require('cors')
const {client, pool} = require('./config')
import {response} from 'express';
import {MiddlewareFn} from './my-types'

// client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err: any, res: {rows: any}) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

const app = express();
const PORT = process.env.PORT || 3000;

const whiskys = express.Router();

app.use('/whiskys', whiskys);

app.use(helmet());

app.use(lib.logResponse);
app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(cors());


whiskys.use(lib.logResponse);
whiskys.use(express.json());
whiskys.use(express.urlencoded({extended: true}))
whiskys.use(cors());

app.get('/', <MiddlewareFn>function(req, res) {
  res.send('Welcome to the Whiskey Store. Navigate to \'/whiskys\' to view the current JSON data.');
});

app.get('/db', async function(req: any, res: any) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM whiskys');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/db', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

whiskys.get('/', <MiddlewareFn>function(req, res) {
  pool.query('SELECT * FROM whiskys ORDER BY id ASC', (error: any, results: {rows: any;}) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
});

whiskys.post('/', <MiddlewareFn>function(req, res) {

  const type = req.body.type;

  pool.query('SELECT * FROM whiskys WHERE type = ($1)', [type], (error: any, results: {rows: any;}) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(200).json(results.rows);
  })
});

whiskys.post('/id', <MiddlewareFn>function(req, res) {

  const id = req.body.id;

  pool.query('SELECT * FROM whiskys WHERE id = ($1)', [id], (error: any, results: {rows: any;}) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(200).json(results.rows);
  })
});

whiskys.post('/update', <MiddlewareFn>function(req, res) {
  type IdType = {id: number};

  const body = req.body;
  const bodyVals = Object.values(body);
  const bodyKeys = Object.keys(body);
  const valuesWithID = Array.from(new Set([...bodyVals, body.id]));
  const keysWithID = Array.from(new Set([...bodyKeys, body.id]));

  const mapKeysToQuery: string[] = keysWithID.map((prop, index) => {
    if (index < keysWithID.length) return `WHERE id = $${index + 1};`;
    else if (index === keysWithID.length - 2) return `${prop} = $${index + 1}`;
    return `${prop} = $${index + 1},`;
  });

  const joinedQueries = `UPDATE whiskys SET ${mapKeysToQuery.join(' ')}`;

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

whiskys.post('/add', <MiddlewareFn>function(req, res) {
  const updatedType = req.body;
  const {type, name} = req.body;
  const value = req.body.value;
  console.log('UPDATED:', updatedType);

  pool.query('INSERT INTO whiskys (type, value, name) values ($1, $2, $3)', [type, value, name], (error: any, results: {rows: any;}) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(200).json({status: 'success', message: 'Whisky added.'});
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

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
