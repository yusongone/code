var express=require('express');
var MongoClient = require('mongodb').MongoClient,
    Db= require('mongodb').Db,
    Server=require("mongodb").Server
  , assert = require('assert');
process.setMaxListeners(0);


// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
var count=0;
var i=0;
var db=new Db('song',new Server('localhost',27017));
var ddd;
    db.open(function(err, _p_db) {
      ddd=_p_db;
    });

function create(cb){
    /*
     *
    */
    var c=ddd.collection("books");
    c.find().toArray(function(a,b){
      console.log(a,b);
        cb?cb():"";
    });
};


var app=express();
app.listen(3330);



app.get("/test",function(req,res,next){
    console.log("efefef");
    create(function(){
        res.write("a");
        res.end();
    });
});

app.get("/",function(req,res,next){
    res.write("<!DOCTYPE html>");
    res.write("<html>");
    res.write("<body>");
    res.write("</body>");
    res.write("</html>");
    var i=0;
    setInterval(function(){
        res.write("abcd");
        i++;
    },2000);

});








