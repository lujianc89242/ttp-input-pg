const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
// const router = require('./router');
const client = require("./client-config");
const bodyParser = require('body-parser');
app.use(bodyParser.json());

var jsonParser = bodyParser.json();

app.get("/api/input", (req, res) => {
    // console.log('In the router get');
    // use our client to get all of our hats from our database
    // by creating raw sql query to be passed to query method
  client.query("select * from input_app", (err, data) => {
      // log any errors that you encounter
    if (err) return console.error(err);
    // map over the array of returned rows and log them into your console
    data.rows.forEach(rowObject => {
      console.log(rowObject);
    });
    // send back via http response body the data
    res.send(data.rows);
  });
  return;
});

app.get("/api/input/:inputID", (req, res) => {
    // console.log('In the router get');
    // use our client to get all of our hats from our database
    // by creating raw sql query to be passed to query method
  let inputID = req.params.inputID;
  console.log(inputID);
  client.query(`select * from input_app where id = ${inputID}`, (err, data) => {
      // log any errors that you encounter
    if (err) return console.error(err);
    // map over the array of returned rows and log them into your console
    data.rows.forEach(rowObject => {
      console.log(rowObject);
    });
    // send back via http response body the data
    res.send(data.rows);
  });
  return;
});

app.post("/api/input", jsonParser, (req, res) => {
    // destructure the values you will need off of your response body

  const { input, length } = req.body;
  // const name='new hat', material='cotton', height=4, brim=false;
  console.log(req.body);
  client.query(
      // use string interpolation to create sql query to insert values into db
    `insert into input_app (input,length) values ('${input}',
    '${length}')`,
    (err, data) => {
      if (err) return console.error(err);
      console.log(data);
      // once successful, use query to get all hats from hats table again
      client.query("select * from input_app", (err, data) => {
        data.rows.forEach(rowObject => {
          console.log(rowObject);
        });
        // send all hats back. 201 is http response code for creation successful
        res.status(201).send(data.rows);
      });
    }
  );
  return;
});

app.delete("/api/:inputID", (req, res) => {

  let inputID = req.params.inputID;

  client.query(`delete from input_app where id = ${inputID}`, (err, data) => {
      // log any errors that you encounter
    if (err) return console.error(err);
    // map over the array of returned rows and log them into your console
    data.rows.forEach(rowObject => {
      console.log(rowObject);
    });
    // send back via http response body the data
    res.send(data.rows);
  });

  return;
});

app.listen(port, () => console.log(`listening on port ${port}!`))
