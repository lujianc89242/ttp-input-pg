/*** caseonfigs for express  ***/
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
// const router = require('./router');
const client = require("./client-config");

/*** caseonfigs for sequelize  ***/
const dbusername = 'postgres';
const dbpassword = 'admin123';
const dbport = '5432';
const databaseName = 'postgres';
const postgresUrl= `postgres://${dbusername}:${dbpassword}@localhost:${dbport}/${databaseName}`;
const Sequelize = require('sequelize');
const sequelize = new Sequelize(postgresUrl)

/*** caseonfigs for body-parser  ***/
const bodyParser = require('body-parser');
app.use(bodyParser.json());
var jsonParser = bodyParser.json();

var campuses = sequelize.define('campuses', {
  //create name and material as strings,
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: 'url of image'
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  }

});

var students = sequelize.define('students', {
  //create name and material as strings,
  firstName: {
    type: Sequelize.STRING,
    // allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    // allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: 'url of image'
  },
  gpa: {
    type: Sequelize.DECIMAL,
    validate: {
      min: 0.0,
      max: 4.0
    }
  },
});

students.belongsTo(campuses);     // will add a campusID to students
campuses.hasMany(students);

// {force: true} will drop the table if it already exists
// sequelize.sync() will sync all tables at once
sequelize.sync({force: true})
.then(() => {
  // Table created
  console.log("all tables are now ready to be used.");
});


// Hat.findAll().then(rows => {
//   for(var i = 0; i < rows.length; i++) {
//   var columnData = rows[i].dataValues;
//   var name = columnData.name;
//   var brim = columnData.brim;
//   console.log(name, brim);
//   }
// });


/***   Add a new student       ***/
app.post("/students/add", jsonParser, (req, res) => {
  // destructure the values you will need off of your response body
  const { firstName, lastName, email, imageUrl, gpa } = req.body;
  // const name='new hat', material='cotton', height=4, brim=false;
  console.log(req.body);
  students.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      imageUrl: imageUrl,
      gpa:  gpa
  });
  res.status(201).send();
  return ;
});

/***   Get all students records    ***/
app.get("/students", (req, res) => {
    students.findAll().then(student => {
    // console.log(student);
    res.send(student);
    });
    return;
});

/***   Get one student record by their ID    ***/
app.get("/students/:inputID", (req, res) => {
  const inputID = req.params.inputID;
  students.findById(inputID)
  .then(student => {
    // console.log(student);
    res.send(student);
  });
  return;
});

/***   Update a student's record       ***/
app.put("/students/update", jsonParser, (req, res) => {
  // destructure the values you will need off of your response body
  const {id, firstName, lastName, email, imageUrl, gpa, campusID } = req.body;
  students.update({
    firstName: firstName,
    lastName: lastName,
    email: email,
    imageUrl: imageUrl,
    gpa: gpa,
    campusID: campusID
  },{ where: {id: id} }).then(
    res.status(201).send("successfully updated!"));
  // res.status(200).send(students.findAll());
  return ;
});

/***   Delete a student's record       ***/
app.delete("/students/:inputID", (req, res) => {

  let inputID = req.params.inputID;

  students.destroy({
    where: {
      id: inputID
    }
  }).then(
    res.status(200).send("successfully deleted!"));

  return ;
});

app.listen(port, () => console.log(`listening on port ${port}!`));
