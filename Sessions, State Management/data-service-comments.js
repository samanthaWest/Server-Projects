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

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var commentSchema = new Schema({

    "authorName": String,
    "authorEmail": String,
    "subject": String,
    "commentText": String,
    "postedDate": Date,

    // array of objects 
    "replies": [{
        "comment_id": String,
        "authorName": String,
        "authorEmail": String,
        "commentText": String,
        "repliedDate": Date
    }]
});

let Comment; // to be defined in initialize **

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://west:pass123@ds141937.mlab.com:41937/web322_a6");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           Comment = db.model("comments", commentSchema);
           resolve();
        });
    });
};

module.exports.addComment = function (data) {
    return new Promise(function (resolve,reject){
    // set posted date to current date
    data.postedDate = Date.now();
    // create new comment with data passed
    let newComment = new Comment(data);
    // save new commment
    newComment.save((err) => {
        
        if(err){
            reject();
        } else {
            resolve(newComment._id);
        }
    });
    });
};

module.exports.getAllComments = function () {
    return new Promise(function (resolve,reject){
        Comment.find()
        .sort({postedDate:1}) // 1 specifys ascending order
        .exec()
        .then((data) =>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.addReply = function (data){
    return new Promise(function (resolve,reject){
        // set replied date to today
       data.repliedDate = Date.now(); 
       Comment.update({ _id: data._id},
    { $addToSet: { replies: data }}, 
    {multi: false }).exec();
    resolve();
    }).catch((err) => {
        reject();
    });
};
