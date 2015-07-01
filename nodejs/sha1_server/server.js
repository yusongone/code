var sha1=require("sha1");
var express=require("express");
var cors=require("cors");
var cookieParser=require("cookie-parser");
var bodyParser=require("body-parser");

var app=express();
app.listen(3240);

app.use(cookieParser("keyboard cat"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
      extended: true
}));

var whitelist = ['http://example1.com', 'http://example2.com'];

var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};

app.post("/test",cors(),function(req,res,next){
  var str=req.body.str;
  var temp={};
  temp.result=sha1(str);
  res.send(temp);
});


