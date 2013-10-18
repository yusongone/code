var ejs=require("ejs");
    config=require("../config.json");
var js_version=config.js_version,
    css_version=config.css_version;
    var fs=require("fs");
    var db=require("../db/client");


function router(app){
    app.get('/', function(req, res){
          res.send('hello world');
          console.log("fddf");
    });
    app.get('/read', function(req, res){
        db.getImage();
    });
    app.get('/login', function(req, res){
        res.render("login",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"login",
        });
    });
    app.get('/uploadImage', function(req, res){
        res.render("uploadImage",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"uploadImage"
        });
    });
    app.get('/getImage', function(req, res){
        db.get(function(data){
             res.writeHead(200, {'Content-Type': 'image/gif' });
            res.end(data, 'binary');
        
        });
        /*
        res.render("uploadImage",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"uploadImage"
        });
        */
    });


    app.post('/upload', function(req, res){
        var file=req.files.dfile;
        db.putImage(file);

    });
}
exports.init=function(app){
    router(app);
}
