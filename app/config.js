"use strict";
exports.__esModule = true;
require('dotenv').config();
// const { Client } = require('pg');
// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });
// const {Pool} = require('pg');
// const isProduction: boolean = process.env.NODE_ENV === 'production';
// const connectionString: string = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
// console.log(connectionString)
// const pool = new Pool({
//   // connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
//   connectionString: process.env.DATABASE_URL,
//   ssl: true,
// });
var Pool = require('pg').Pool;
var pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
module.exports = { pool: pool };
