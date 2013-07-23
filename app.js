/*
dule dependencies.
 */

var express = require('express'),
	http = require('http'),
	canvas= require('canvas'),
	socketIO = require("socket.io");
//var paserCookie=require("./lib/paserCookie");
//var parseSigendCookie=require("connect").utils.parseSignedCookie;
var MemoryStore=new express.session.MemoryStore;
//var app = express.createServer();
var app=express();

var i=0;

// Configuration
app.configure(function(){
	app.set("title","webOne");
	app.set('views', __dirname + '/views');
	app.set("view options",{layout:false});
	app.set('view engine','ejs');
	app.use(express.cookieParser("keyboard cat"));
	app.use(express.session({
		"secret":"secret",
		"store":MemoryStore
	}));
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get("/",function(req,res){
	res.render("index",{"title":req.session.userId});	
});

app.post("/ss/login",function(req,res){		
		req.session.userId=req.body.na;
		res.send({"result":"ok","name":req.body.na});
});


app.listen(3000,function(){
	console.log("f");
//	var io=socketIO.listen(app);
});
