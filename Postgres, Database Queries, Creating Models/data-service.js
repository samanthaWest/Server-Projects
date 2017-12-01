/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Samantha West  Student ID: 128111168 Date: 11/29/2017
*
*  Online (Heroku) Link: https://enigmatic-coast-56976.herokuapp.com/
*
********************************************************************************/ 

const Sequelize = require('sequelize');

var sequelize = new Sequelize('dc2rgm01n5k6fb', 'fiylpqjpvlecka', '8cab78857a40bc9cd53a6b6b575cde8df753b69ecbbf260344fc275779031482', {
host: 'ec2-204-236-239-225.compute-1.amazonaws.com',
dialect: 'postgres',
port: 5432,
dialectOptions: {
    ssl: true
}
});

sequelize.authenticate().then(function(){
    console.log("AUTHENTICATED");
}).catch(function(error){
    console.log("NOT AUTHENTICATED" + error);
});
 
// Employee Model
var Employees = sequelize.define('Employees',{
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "project_id" as a primary key
        autoIncrement: true // automatically increment the value
    },
    firstName: {
        type: Sequelize.STRING,
        isAlpha: true
    },
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
    department: {
        type: Sequelize.INTEGER,
        foreignKey: true
    },
    hireDate: Sequelize.STRING
},{
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

// Department Model
var Departments = sequelize.define('Departments',{
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
},{
    createdAt: false,
    updatedAt: false
});

// test
//Employees.belongsTo(Departments);

// Update to seperate functions into own library
module.exports = {

    initialize : initialize = () => { 
    return new Promise(function (resolve,reject){
        sequelize.sync().then((Employees) => {
            resolve();
        }).then((Departments) => {
            resolve();
        }).catch((error) => {
            console.log(error);
            reject("Sorry, unable to sync the database :/ ")
        })
    });
},

getAllEmployees : getAllEmployees = () => {
    return new Promise(function (resolve,reject){
      sequelize.sync().then(function (){
        Employees.findAll({
            // return all employee data
        }).then(function(data){
            resolve(data);
        }).catch(function(error){
            console.log("No data returned");
            reject();
        })
      });
    });
 },

 getEmployeesByStatus : getEmployeesByStatus = (status) => {
    return new Promise(function (resolve, reject){
        sequelize.sync().then(function(){
            Employees.findAll({
                where: {
                    status: status // case sensitive http://localhost:8080/employees?status=Full  Time or ?status=Part Time
                                   // When linking for searching and such watch out for case sensitivy, function works!! **NOTE**
                   }      
            }).then(function(data){
                resolve(data);
            }).catch(function(){
                console.log("No data found for " + status);
                reject();
            });
        });
    });
},

getEmployeesByDepartment : getEmployeesByDepartment = (department) => {
    return new Promise(function (resolve, reject){
        sequelize.sync().then(function(){
            Employees.findAll({
                where: {
                    department: department
                   } 
            }).then(function(data){
                resolve(data);
            }).catch(function(){
                console.log("No data found for " + department);
                reject();
            });
        });
    });
},

getEmployeesById : getEmployeesById = (numb) => {
    return new Promise(function (resolve, reject){
       sequelize.sync().then(function(){
        resolve(Employees.findAll({
            where :{
                employeeNum: numb
            }
        }))}).catch(function(error){
            reject();
        });    
    });
},

getEmployeesByManager : getEmployeesByManager = (manager) => {
    return new Promise(function (resolve, reject){
        sequelize.sync().then(function(){
            Employees.findAll({
               where: {
                employeeManagerNum: manager
               } 
            }).then(function(data){
                resolve(data);
            }).catch(function(){
                console.log("No data found for " + manager);
                reject();
            });
        });
    });
},

getManagers : getManagers = () => {
    return new Promise(function (resolve, reject){
        sequelize.sync().then(function(){
            Employees.findAll({
               where: {
                isManager: true
               } 
            }).then(function(data){
                resolve(data);
            }).catch(function(){
                console.log("No data found for ");
                reject();
            });
        });
    });
},

getAllDepartments : getAllDepartments = () => {
    return new Promise(function (resolve, reject){
        sequelize.sync().then(function(){
            Departments.findAll({
                // return all department data
            }).then(function(data){
                resolve(data);
            }).catch(function(){
                console.log("No data found for ");
                reject();
            });
        });
    });
},


addEmployee : addEmployee = (employeeData) => {
    console.log("Need to know ");
    employeeData.isManager = (employeeData.isManager) ? true : false;

    return new Promise(function (resolve, reject){
        
       sequelize.sync().then(function(){ 
        
        for (let prop in employeeData) {
            if(employeeData[prop] == ""){
                employeeData[prop] = null;
            }
        }
        Employees.create({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            last_name: employeeData.last_name,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            martialStatus: employeeData.martialStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }).then(function(){
            console.log("Record created");
            resolve();
        }).catch(function (error){
            // console.log(error);
            console.log("Error creating employee, unable to create profile.");
            reject();
        });
        });
    });
},

updateEmployee : updateEmployee = (employeeData) => {
    
    employeeData.isManager = (employeeData.isManager) ? true : false;
    
        return new Promise(function (resolve, reject){
            
           sequelize.sync().then(function(){ 
            
            for (let prop in employeeData) {
                if(employeeData[prop] == ""){
                    employeeData[prop] = null;
                }
            }
            Employees.update({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                last_name: employeeData.last_name,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addresCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                martialStatus: employeeData.martialStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            },{
                    where:{
                        employeeNum: employeeData.employeeNum
                    }
            }).then(function(){
                console.log("Record created");
                resolve();
            }).catch(function (error){
                //console.log(error);
                console.log("Error creating employee, unable to create profile.");
                reject();
            });
            });
        });
},

// new functions..
addDepartment : addDepartment = (departmentData) => {
    return new Promise(function (resolve, reject){
        
       sequelize.sync().then(function(){ 
        
        for (let prop in departmentData) {
            if(departmentData[prop] == ""){
                departmentData[prop] = null;
            }
        }
        Departments.create({
            departmentId: departmentData.departmentData,
            departmentName: departmentData.departmentName
        }).then(function(){
            console.log("Record created");
            resolve();
        }).catch(function (error){
            console.log(error);
            console.log("Error creating department, unable to create profile.");
            reject();
        });
        });
    });
},

updateDepartment : updateDepartment = (departmentData) => {
    return new Promise(function (resolve, reject){
        
       sequelize.sync().then(function(){ 
        
        for (let prop in departmentData) {
            if(departmentData[prop] == ""){
                departmentData[prop] = null;
            }
        }
        Departments.update({
            departmentName: departmentData.departmentName
        },{
            where:{
                departmentId: departmentData.departmentId
        }
        }).then(function(){
            console.log("Record created");
            resolve();
        }).catch(function (error){
            console.log(error);
            console.log("Error creating department, unable to create profile.");
            reject();
        });
     });
 });
},

getDepartmentById : getDepartmentById = (id) => {
    return new Promise(function (resolve, reject){
       sequelize.sync().then(function (){
        Departments.findAll({
            where: {
             departmentId: id
            } 
         }).then(function(data){
             resolve(data);
         }).catch(function(error){
             reject("No results returned");
         });
       })  
    });
},

deleteEmployeeByNum : deleteEmployeeByNum = (empNum) => {
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function () {
            Employees.destroy({
                where: {
                  employeeNum: empNum  
                }
            }).then(function(){
                resolve();
                console.log("Employee Deleted");
            }).catch(function(error){
                reject();
                console.log("Employee file not delete, error deleting sorry!");
            })
        })
      });
},

// edit later extra from me 
searchbar : searchBar = (search) => {
    return new Promise(function (resolve, reject){
        sequelize.sync().then(function(){
            resolve(Employees.findAll({
                where :{
                    employeeNum: search
                }
            }))}).catch(function(error){
                // console.log(error);
                reject();
            });  
     });
}
// end of modules.exports
}
