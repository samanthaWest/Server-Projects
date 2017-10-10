/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Samantha West  Student ID: 128111168 Date: 10/08/2017
*
*  Online (Heroku) Link: https://enigmatic-coast-56976.herokuapp.com/
*
********************************************************************************/ 

// Module for file reading
var fs = require('fs');

// Global arrays to store data
var employees = [];
var departments =[];
var empCount = 0;

// Update to seperate functions into own library
module.exports = {

    initialize : initialize = () => {
    
    return new Promise(function (resolve,reject){
       
        fs.readFile("./data/employees.json", "UTF-8" ,
        function(err,contents) {
        if (err) reject("Unable to read file");
        employees = JSON.parse(contents);
        //resolve(employees);
        empCount = employees.length;        
    });

     fs.readFile("./data/departments.json", "UTF-8" ,
     function(err,contents) {
     if (err) reject("Unable to read file");
     departments = JSON.parse(contents);
     resolve(departments,employees); // after both files have read send data back
    });
   });
},

getAllEmployees : getAllEmployees = () => {
    return new Promise(function (resolve,reject){
        initialize().then(function(result){
            if(employees.length === 0) {
                reject("No Results Returned");
            }
            resolve(employees);
         })
    })
 },

 getEmployeesByStatus : getEmployeesByStatus = (status) => {
    return new Promise(function (resolve, reject){
        initialize().then(function (result){
            if(employees.length === 0) {
                reject("No Results Found");
            }
            let statArray = [];
            
            for(i in employees){
                if(employees[i].status === status)
                statArray.push(employees[i]);
            }
            resolve(statArray);
        })
    })
},

getEmployeesByDepartment : getEmployeesByDepartment = (d_number) => {
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
},

getEmployeesById : getEmployeesById = (id) => {
    return new Promise(function (resolve, reject){
        initialize().then(function (result){
            if(employees.length === 0) {
                reject("No Results Found");
            }
            let empArray = [];

            for(i in employees){
                if(employees[i].employeeNum == id){
                empArray.push(employees[i]);
                }
            }
            resolve(empArray);
        })
    })
},

getEmployeesByManager : getEmployeesByManager = (manager) => {
    return new Promise(function (resolve, reject){
        initialize().then(function (result){
            if(employees.length === 0) reject ("No Results Found");
        
            let mArray = [];
            console.log(manager);
            for(i in employees){
                if(employees[i].employeeManagerNum == manager){
                mArray.push(employees[i]);
                }
            }
            resolve(mArray);
        })
    })
},

getManagers : getManagers = () => {
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
},

getAllDepartments : getAllDepartments = () => {
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
},

addEmployee : addEmployee = (employeeData) => {
    return new Promise(function (resolve, reject){
            // increase empcount
            empCount = empCount + 1;
            // console.log(empCount);
            // console.log(employeeData);
            // assign employee number
            employeeData.employeeNum = empCount;
            // console.log(employeeData.employeeNum);
            // add new employee to the array
            employees.push(employeeData);    
            
            resolve();
        })   
},

updateEmployee : updateEmployee = (employeeData) => {
    return new Promise(function (resolve, reject){
           // find index of employee num which matches emp data
        let index = 0;

           for (i in employees){
            if(employeeData.employeeNum == employees[i].employeeNum){
                index = i;
            }
        }
            console.log(index); // check for right index selection i.e emp 21 will equal emp index 20 in array
            // overwrite old data in employee slot
            employees[index] = employeeData;
            resolve();
        })   
}
// end of modules.exports
}