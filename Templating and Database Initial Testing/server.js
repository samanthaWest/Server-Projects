/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Samantha West Student ID: 128111168 Date: 10/08/2017
*
*  Online (Heroku) Link: https://enigmatic-coast-56976.herokuapp.com/
*
********************************************************************************/ 

var express = require("express");
var app = express();
var path = require("path");
var ds = require("./data-service"); // require module
const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('hostname', 'username', 'password', {
    host: 'host url',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

// when defineing a new tabes make sure to delete
// old one on pgadmin3 or else will fail when connecting ** 

// Employee table 
var EmployeeTable = sequelize.define('EmployeeTable',{
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "project_id" as a primary key
        autoIncrement: true // automatically increment the value
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.INTEGER,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.INTEGER,
    martialStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.DATE
},{
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

// Department table
var DepartmentTable = sequelize.define('DepartmentTable',{
    departmentId:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    departmentName: Sequelize.STRING
 },{
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
    });

// One to One Relation
EmployeeTable.belongsTo(DepartmentTable);

// synchronize the Database with our models and automatically add the 
// table if it does not exist

sequelize.sync().then(function () {
    
    EmployeeTable.create({
        //title: 'Project1',
        //description: 'First Project'
    }).then(function (EmployeeTable) {
        // you can now access the newly created Project via the variable project
        console.log("success!")
    }).catch(function (error) {
        console.log("something went wrong!");
    });

    DepartmentTable.create({
        //title: 'Project1',
        //description: 'First Project'
    }).then(function (DepartmentTable) {
        // you can now access the newly created Project via the variable project
        console.log("success!")
    }).catch(function (error) {
        console.log("something went wrong!");
    });

});

// Update for assignment #4
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');

var HTTP_PORT = process.env.PORT || 8080;
function onHttpStart(){
    console.log("Http Server Listening on: " + HTTP_PORT);
}

// For CSS and Image Files
app.use(express.static('./public'));
// For hbs layout images
app.use(express.static('./views/images'));
// For icons
app.use(express.static('./views/images/icons'));

// Update for assignment #4
app.use(bodyParser.urlencoded({ extended: true }));

app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: 'layout',
    helpers: {
        equal: function (lvalue, rvalue, options){
            if(arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 paramters");
            if(lvalue != rvalue){
                return options.inverse(this);
             } else {
                return options.fn(this);
                }
            },
            strong: function(options){
                return '<strong>' + options.fn(this) + '</strong>';
            },
            list: function(context, options){
                var ret = "<ul>";
                
                    for(var i = 0; i < context.length; i++) {
                        ret = ret + "<li>" + options.fn(context[i]) + "</li>";
                    }
                
                    return ret + "</ul>";
            }
        }
}));

app.set("view engine", ".hbs");

// Home Page
app.get("/", (req,res) => {
    //res.sendFile(path.join(__dirname + "/views/home.html"))
    res.render("home");
});

// About Page
app.get("/about",(req,res) => {
   // res.sendFile(path.join(__dirname + "/views/about.html"));
    res.render("about");
});

// Add Employees (GET)
app.get("/employees/add",(req,res) => {
    // res.sendFile(path.join(__dirname + "/views/about.html"));
     res.render("addEmployees");
 });

 // Add Employees (POST ADD)
app.post("/employees/add", (req,res) => {
    // console.log(req.body);
    ds.addEmployee(req.body).then(function(){
        res.redirect("/employees");
    });
});

// Add Employees (POST UPDATE)
app.post("/employee/update", (req,res) => {
    ds.updateEmployee(req.body).then(function(){
        res.redirect("/employees");
    });
});

// Employee Queries 
app.get("/employees", (req,res) => {
     if(req.query.status){
    ds.getEmployeesByStatus(req.query.status).then(function (data){
        res.render("employeeList",
         { data: data, title: "EmployeesByStatus" }); 
    })
    .catch(function(){
        res.render("employeeList",
        { data: {}, title: "EmployeesByStatus" });
    })
    /////
     } else if (req.query.department){
    ds.getEmployeesByDepartment(req.query).then(function(data){
        res.render("employeeList",
        { data: data, title: "EmployeesByDepartment" }); 
    })
    .catch(function(){
        res.render("employeeList",
        { data: {}, title: "EmployeesByDepartment" }); 
    })
    /////
     } else if(req.query.manager){
        ds.getEmployeesByManager(req.query.manager).then(function (data){
            res.render("employeeList",
            { data: data, title: "EmployeeByManager" }); 
        })
        .catch(function(){
            res.render("employeeList",
            { data: {}, title: "EmployeeByManager" }); 
        })
     } else {
    /////
        ds.getAllEmployees().then(function(data){
            res.render("employeeList",
             { data: data, title: "Employees" }); 
        })      
        .catch(function(){
            res.render("employeeList", 
            { data: {}, title: "Employees" }); 
        });
     }
});

// GET data by employee number
app.get("/employees/:value",(req,res) => {
    ds.getEmployeesById(req.params.value).then(function(data){
        res.render("employee", 
        { data: data}); 
        // console.log(data);
})      
.catch(function(){
    res.status(404).send("Employee Not Found"); 
});
});

// GET managers
app.get("/managers", (req,res) => {
    ds.getManagers().then(function(data){
        res.render("employeeList", 
        { data: data, title: "Employees (Managers)" }); 
})      
.catch(function(){
    res.render("employeeList", 
    { data: {}, title: "Employees (Managers)" }); 
});
});

// SEARCH (GET) employee data
app.get("/search",(req,res) =>{
    ds.searchbar(req.query.search).then(function(data){
        res.render("employeeprofile.hbs",
    {data : data, title : "Employee #"});
    });
});

app.get("/credits",(req,res) =>{
    res.render("credits");
});

// GET departments
app.get("/departments", (req,res) => {
      ds.getAllDepartments().then(function(data){
        res.render("departmentList", 
        { data: data, title: "Departments" }); 
      })
      .catch(function(){
        res.render("departmentList", 
        { data: {}, title: "Departments" }); 
      })
      
    });

// ERROR 404 (no matching response route)
app.use((req,res) => {
    res.status(404).send("Error 404 : Page Not Found");
});

 // Call initialize and listen on requests
ds.initialize().then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    res.send(err);
});

  
