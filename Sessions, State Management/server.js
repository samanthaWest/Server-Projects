/*********************************************************************************
*  WEB322 – Assignment 07
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Samantha West Student ID: 128111168 Date: 12/23/2017
*
*  Online (Heroku) Link: https://enigmatic-coast-56976.herokuapp.com/
*
********************************************************************************/ 
const express = require("express");
const app = express();
var path = require("path");
var ds = require("./data-service"); // require module
var dataServiceAuth = require('./data-service-auth');
const clientSessions = require("client-sessions");
const dataServiceComments = require("./data-service-comments.js");
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

// client sessions middleware
app.use(clientSessions({
    cookieName: "session", //obj which will be added to req
    secret: "web322_A7",
    duration: 2 * 60 * 1000, // 2minutes
    activeDuration: 100 * 60 // will be extended by this each req
}));

// ensure templates have access to session object
// {{session.user}} to hide and show elements to user depending on whether they are logged in
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
  });

// middleware func to check if user is logged in 
function ensureLogin(req,res,next){
    if(!req.session.user){
        res.redirect("/login");
    }else{
        next();
    }
}
  
// Home Page //
app.get("/", (req,res) => {
    res.render("home");
});

// About Page //
app.get("/about",(req,res) => {
   dataServiceComments.getAllComments().then(function(data){
      // console.log(data);
        res.render("about", 
        { data: data }); 
    }).catch(function(err){
        res.render("about");
    });
});

// Add Employees //
app.get("/employees/add", ensureLogin, (req,res) => {
    ds.getAllDepartments(req.body).then(function(data){
        res.render("addEmployees", {departments: data});
    }).catch(function(error){
        res.render("addEmployees", {departments: []});
    });
 });

app.post("/employees/add", ensureLogin, (req,res) => {
    ds.addEmployee(req.body).then(function(){
        res.redirect("/employees");
    }).catch(function(error){
        console.log(error);
    });
});

// Update Employees // 
app.post("/employee/update", ensureLogin, (req,res) => {
    ds.updateEmployee(req.body).then(function(){
        res.redirect("/employees");
    });
});

// Employee Queries //
app.get("/employees", ensureLogin, (req,res) => {
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
app.get("/employee/delete/:empNum", ensureLogin, (req,res) => {
    ds.deleteEmployeeByNum(req.params.empNum).then(function(data){
        res.redirect("/employees");
    }).catch(function(error){
        res.status(404).send("Unable to Remove Employee / Employee Not Found!");
    });
});

// GET Employee By Number 
app.get("/employees/:empNum", ensureLogin, (req, res) => {
    
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
app.get("/managers", ensureLogin, (req,res) => {
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
app.get("/departments", ensureLogin, (req,res) => {
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
app.get("/departments/add", ensureLogin, (req,res) => {
    res.render("addDepartment");
 });

app.post("/departments/add", ensureLogin, (req,res) => {
   ds.addDepartment(req.body).then(function(){
        res.redirect("/departments");
    });
});

// Update Departments //
app.post("/department/update", ensureLogin, (req,res) => {
    ds.updateDepartment(req.body).then(function(){
        res.redirect("/departments");
    });
});

// GET department(ID)
app.get("/departments/:value", ensureLogin, (req,res) => {
    ds.getDepartmentById(req.params.value).then(function(data){
        res.render("department", 
        { data: data}); 
})      
.catch(function(){
    res.status(404).send("Employee Not Found"); 
    });
});

// Add Comment
app.post("/about/addComment", (req,res) => {
    dataServiceComments.addComment(req.body).then(function(){
        res.redirect("/about");
    }).catch(function(err){
        res.send(err);
    });
});

// Add Reply
app.post("/about/addReply", (req,res) => {
    dataServiceComments.addReply(req.body).then(function(){
        //console.log(req.body);
        res.redirect("/about");
    }).catch(function(err){
        res.send(err);
    });
});

// Login
app.get("/login", (req,res) => {
    res.render("login");
 });

 // Register
 app.get("/register", (req,res) => {
    res.render("register");
 });

 // Register
 app.post("/register", (req,res) => {
    dataServiceAuth.registerUser(req.body).then(() =>{
        res.render("register", {successMessage: "User Created"});

    }).catch((err) => {
        res.render("register", {errorMessage: err, user: req.body.user});
    })
 });

 // Login
 app.post("/login", (req,res) => {
    dataServiceAuth.checkUser(req.body).then(() => {
        req.session.user ={
            username: req.body.user
        };
        res.redirect("/employees");
    }).catch((err) =>{
        res.render("login", {errorMessage: err, user: req.body.user});
    });
 });

 // Logout
 app.get("/logout", (req,res) => {
    res.redirect("/");
 });

// ERROR 404 (no matching response route)
app.use((req,res) => {
    res.status(404).send("Error 404 : Page Not Found");
});

/*
 // Call initialize and listen on requests
ds.initialize()
.then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    res.send(err);
});
  */

  /*
ds.initialize()
.then(dataServiceComments.initialize())
.then(dataServiceAuth.initialize())
.then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    res.send(err);
});

*/

ds.initialize() 
.then(dataServiceComments.initialize) 
.then(dataServiceAuth.initialize)
.then(()=>{ 
   app.listen(HTTP_PORT, onHttpStart); 
}) 
.catch((err)=>{ 
   console.log("unable to start the server: " + err); 
}); 

