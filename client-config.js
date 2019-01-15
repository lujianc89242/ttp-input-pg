// npm install --save pg to be able to require pg
const pg = require("pg");
// configure the path to the database that you wish to interact with
const username = 'postgres';
const password = 'admin123';
const port = '5432';
const databaseName = 'input_app';
const postgresUrl= `postgres://${username}:${password}@localhost:${port}/${databaseName}`;
var express = require('express');


// create a new client
const client = new pg.Client(postgresUrl);
// connect your client to your database

client.connect();
// export the client to use elsewhere in your express app for working with queries.
module.exports = client;
