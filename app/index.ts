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

interface BodyTypes {
  id?: number;
  type?: string;
  value?: number;
  name?: string;
}

whiskys.post('/', <MiddlewareFn>function(req, res) {
  const {pageIndex} = req.body;

  const limit = 2;
  const offset = limit * Number(pageIndex);

  pool.query('SELECT * FROM whiskys ORDER BY id ASC LIMIT $1 OFFSET $2;', [limit, offset], (error: any, results: {rows: any;}) => {
    if (error) {
      throw error
    }
    console.log('Results:', results);
    res.status(200).json(results.rows);
  });
});

whiskys.get('/count', <MiddlewareFn>function(req, res) {
  pool.query('SELECT COUNT(*) FROM whiskys', (error: any, results: {rows: any;}) => {
    if (error) {
      throw error
    }
    console.log('Results:', results);
    res.status(200).send(results.rows[0].count);
  })
});

whiskys.get('/limit', <MiddlewareFn>function(req, res) {

  const {pageIndex} = req.body;

  const limit = 2;
  const offset = limit * pageIndex;

  pool.query('SELECT * FROM whiskys ORDER BY id ASC LIMIT $1 OFFSET $2;', [limit, offset], (error: any, results: {rows: any;}) => {
    if (error) {
      throw error
    }
    console.log('Results:', results);
    res.status(200).json(results.rows);
  });
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

whiskys.put('/update', <MiddlewareFn>function(req, res) {
  type IdType = {id: number};

  const {type, value, name}: BodyTypes = req.body;
  const {id}: IdType = req.body;

  if (id) {
    pool.query('UPDATE whiskys SET type = $1, value = $2, name = $3 WHERE id = $4', [type, value, name, id], (error: any, results: {rows: any;}) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.status(200).json({status: 'success', message: 'Whisky updated.'});
    });
  }
});

whiskys.post('/add', <MiddlewareFn>function(req, res) {
  const updatedType = req.body;
  const {type, name, value} = req.body;
  // const value = req.body.value;
  console.log('UPDATED:', updatedType);

  pool.query('INSERT INTO whiskys (type, value, name) values ($1, $2, $3)', [type, value, name], (error: any, results: {rows: any;}) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(200).json({status: 'success', message: 'Whisky added.'});
  });
});

whiskys.delete('/delete', <MiddlewareFn>function(req, res) {
  type IdType = {id: number};
  const {id}: IdType = req.body;
  pool.query('DELETE FROM whiskys WHERE id = $1', [id], (error: any, results: {rows: any;}) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(200).json({status: 'success', message: 'Whisky deleted.'});
  });
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
