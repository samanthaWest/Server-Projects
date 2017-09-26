var express = require("express");
var app = express();
var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;
function onHttpStart(){
    console.log("Http Server Listening on: " + HTTP_PORT);
}

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname + "/views/home.html"))
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.use(express.static('public'));

app.listen(HTTP_PORT, onHttpStart);
