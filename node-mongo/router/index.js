var ejs=require("ejs");
    config=require("../config.json");
var js_version=config.js_version,
    css_version=config.css_version;


function router(app){
    app.get('/', function(req, res){
          res.send('hello world');
          console.log("fddf");
    });
    app.get('/login', function(req, res){
        res.render("login",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"login",
            "list":"ab"
        });
    });
    app.get('/uploadImage', function(req, res){
        res.render("uploadImage",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"",
        }):
    });


    app.post('/upload', function(req, res){
        
    });
}
exports.init=function(app){
    router(app);
}
