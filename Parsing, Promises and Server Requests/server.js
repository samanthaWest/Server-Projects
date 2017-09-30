/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Samantha West Student ID: 128111168 Date: 9/30/2017
*
*  Online (Heroku) Link: https://enigmatic-coast-56976.herokuapp.com/
*
********************************************************************************/ 

var express = require("express");
var app = express();
var path = require("path");
var ds = require('./data-service.js'); // require module

var HTTP_PORT = process.env.PORT || 8080;
function onHttpStart(){
    console.log("Http Server Listening on: " + HTTP_PORT);
}

// For CSS and Image Files
app.use(express.static('public'));

// Home Page
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"))
});

// About Page
app.get("/about",(req,res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});


// Employee Queries 
app.get("/employees", (req,res) => {
     if(req.query.status){
    getEmployeesByStatus(req.query).then(function (result){
       console.log("STTS");
        res.json(result);
    })
    .catch(function(reason){
        res.send(reason);
    })
    /////
     } else if (req.query.department){
    getEmployeesByDepartment(req.query).then(function(result){
        res.json(result);
    })
    .catch(function(reason){
        res.send(reason);
    })
    /////
     } else if(req.query.manager){
        getEmployeesByManager(req.query).then(function (result){
            res.json(result);
        })
        .catch(function(reason){
            res.send(reason);
        })
     } else {
    /////
        getAllEmployees().then(function(result){
                res.json(result);
        })      
        .catch(function(reason){
            res.send(reason);
        });
     }
});

// GET data by employee number
app.get("/employees/:value",(req,res) => {
    getEmployeesById(req.params.value).then(function(result){
        res.json(result);
})      
.catch(function(reason){
    res.send(reason);
});
});

// GET managers
app.get("/managers", (req,res) => {
    getManagers().then(function(result){
        res.json(result);
})      
.catch(function(reason){
    res.send(reason);
});
});


// GET departments
app.get("/departments", (req,res) => {
      getAllDepartments().then(function(result){
          res.json(result);
      })
      .catch(function(reason){
          res.send(reason);
      })
      
    });

// ERROR 404 (no matching response route)
app.use((req,res) => {
    res.status(404).send("Error 404 : Page Not Found");
});

 // Call initialize and listen on requests
initialize().then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    res.send(err);
});

  
