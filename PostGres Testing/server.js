// SAMANTHA WEST 128111168

var express = require('express');
 var pg = require("pg"); 
 var app = express(); 

 // pg connect is not supported, undefined function result with current version installed in visual code

 const { Pool } = require('pg');
 const pool = new Pool ({
    database: 'postgres',
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'west',
    idleTimeoutMillis: 30000,
    max: 10
 })

   var connectionString = "postgres://postgres:west@localhost:5432/postgres"; 
     app.get('/', function (req, res, next) {  
            pool.connect(function(err,client,done) { 
             if(err){          
                    console.log("not able to get connection "+ err);  
                    res.status(400).send(err);        
                }   
                 client.query('SELECT * FROM Employee where empid = $1', [1],function(err,result)    {     
                 done(); // closing the connection; 
                  if(err){           
                    console.log(err);      
                     res.status(400).send(err);   
                                                                                    
             }      
             res.status(200).send(result.rows);    
          });  
       });
  });  
    app.listen(3000, function () {  
           console.log('Server is running.. on Port 3000'); 
   }); 

   // create a simple stored procedure 

   app.get('/sp', function (req,res, next){
       pool.connect(function(err,client,done){
           if(err){
               console.log("unable to connect " + err);
               res.status(400).send(err);
           }
           client.query('SELECT * from GetAllEmployee()' ,function(err,result){
            done();
            if(err){
                 console.log(err);
                 res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});