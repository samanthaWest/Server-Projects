/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Samantha West Student ID: 128111168 Date: 11/29/2017
*
*  Online (Heroku) Link: https://enigmatic-coast-56976.herokuapp.com/
*
********************************************************************************/ 

var express = require("express");
var app = express();
var path = require("path");
var ds = require("./data-service"); // require module


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

// Home Page //
app.get("/", (req,res) => {
    res.render("home");
});

// About Page //
app.get("/about",(req,res) => {
    res.render("about");
});

// Add Employees //
app.get("/employees/add",(req,res) => {
    ds.getAllDepartments(req.body).then(function(data){
        res.render("addEmployees", {departments: data});
    }).catch(function(error){
        res.render("addEmployees", {departments: []});
    });
 });

app.post("/employees/add", (req,res) => {
    ds.addEmployee(req.body).then(function(){
        res.redirect("/employees");
    }).catch(function(error){
        console.log(error);
    });
});

// Update Employees // 
app.post("/employee/update", (req,res) => {
    ds.updateEmployee(req.body).then(function(){
        res.redirect("/employees");
    });
});

// Employee Queries //
app.get("/employees", (req,res) => {
     if(req.query.status){
    ds.getEmployeesByStatus(req.query.status).then(function (data){
        res.render("employeeList",
         { data: data, title: "EmployeesByStatus" }); 
         console.log(data);
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

// GET delete employee by number
app.get("/employee/delete/:empNum", (req,res) => {
    ds.deleteEmployeeByNum(req.params.empNum).then(function(data){
        res.redirect("/employees");
    }).catch(function(error){
        res.status(404).send("Unable to Remove Employee / Employee Not Found!");
    });
});

// GET Employee By Number 
app.get("/employees/:empNum", (req, res) => {
    
      // initialize an empty object to store the values
      let viewData = {};
    
      ds.getEmployeesById(req.params.empNum)
      .then((data) => {
        viewData.data = data; //store employee data in the "viewData" object as "data"
      }).catch(()=>{
        viewData.data = null; // set employee to null if there was an error 
      }).then(ds.getAllDepartments)
      .then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"
    
          // loop through viewData.departments and once we have found the departmentId that matches
          // the employee's "department" value, add a "selected" property to the matching 
          // viewData.departments object
        
         for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.data.department) {
              viewData.departments[i].selected = true;
            }
          }
    
      }).catch(()=>{
        viewData.departments=[]; // set departments to empty if there was an error
      }).then(()=>{
          if(viewData.data == null){ // if no employee - return an error
              res.status(404).send("Employee Not Found");
          }else{
            res.render("employee", { viewData: viewData }); // render the "employee" view
          }
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

// Add Department //
app.get("/departments/add",(req,res) => {
    res.render("addDepartment");
 });

app.post("/departments/add", (req,res) => {
   ds.addDepartment(req.body).then(function(){
        res.redirect("/departments");
    });
});

// Update Departments //
app.post("/department/update", (req,res) => {
    ds.updateDepartment(req.body).then(function(){
        res.redirect("/departments");
    });
});

// GET department(ID)
app.get("/departments/:value",(req,res) => {
    ds.getDepartmentById(req.params.value).then(function(data){
        res.render("department", 
        { data: data}); 
})      
.catch(function(){
    res.status(404).send("Employee Not Found"); 
    });
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
  
