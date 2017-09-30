/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Samantha West  Student ID: 128111168 Date: 9/30/2017
*
*  Online (Heroku) Link: https://enigmatic-coast-56976.herokuapp.com/
*
********************************************************************************/ 

// Module for file reading
var fs = require('fs');

// Global arrays to store data
var employees = [];
var departments =[];


initialize = () => {
    
    return new Promise(function (resolve,reject){
       
        fs.readFile("./data/employees.json", "UTF-8" ,
        function(err,contents) {
        if (err) reject("Unable to read file");
        employees = JSON.parse(contents);
        //resolve(employees);

        
    });

     fs.readFile("./data/departments.json", "UTF-8" ,
     function(err,contents) {
     if (err) reject("Unable to read file");
     departments = JSON.parse(contents);
     resolve(departments,employees); // after both files have read send data back
    });
   });
}

 getAllEmployees = () => {
    return new Promise(function (resolve,reject){
        initialize().then(function(result){
            if(employees.length === 0) {
                reject("No Results Returned");
            }
            resolve(employees);
         })
    })
 }

getEmployeesByStatus = (status) => {
    return new Promise(function (resolve, reject){
        initialize().then(function (result){
            if(employees.length === 0) {
                reject("No Results Found");
            }
            let statArray = [];

            for(i in employees){
                if(employees[i].status == status)
                statArray.push(employees[i]);
            }
            resolve(statArray);
        })
    })
}

getEmployeesByDepartment = (d_number) => {
    return new Promise(function (resolve, reject){
        initialize().then(function (result){
            if(employees.length === 0) {
                reject("No Results Found");
            }
            let depArray = [];

            for(i in employees){
                if(employees[i].department = d_number)
                depArray.push(employees[i]);
            }
            resolve(depArray);
        })
    })
}

getEmployeesById = (id) => {
    return new Promise(function (resolve, reject){
        initialize().then(function (result){
            if(employees.length === 0) {
                reject("No Results Found");
            }
            let empArray = [];

            for(i in employees){
                if(employees[i].employeeNum === id){
                empArray.push(employees[i]);
                }
            }
            resolve(empArray);
        })
    })
}

getEmployeesByManager = (manager) => {
    return new Promise(function (resolve, reject){
        initialize().then(function (result){
            if(employees.length === 0) reject ("No Results Found");
            
            let manArray = [];

            for(i in employees){
                if(employees[i].employeeManagerNum === manager){
                manArray.push(employees[i]);
                console.log(employees[i]);
                }
            }
            resolve(manArray);
        })
    })
}

getManagers = () => {
    return new Promise(function (resolve, reject){
        initialize().then(function (result){
            if(employees.length === 0) reject ("No Results Found");
            
            let manArray = [];

            for(i in employees){
                if(employees[i].isManager === true){
                manArray.push(employees[i]);
                }
            }
            resolve(manArray);
        })
    })
}

getAllDepartments = () => {
    return new Promise(function (resolve, reject){
        initialize().then(function (result){
           if(departments.length === 0) reject("No Results Found");

            let depArray = [];
            for(i in departments){
                depArray.push(departments[i]);
            }
            resolve(depArray);
        })
    })
}