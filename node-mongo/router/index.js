var ejs=require("ejs");


function router(app){
    app.get('/', function(req, res){
          res.send('hello world');
          console.log("fddf");
    });
    app.get('/login', function(req, res){
        res.render("login",{
            "title":"login",
            "list":"ab"
        });
    });
}
exports.init=function(app){
    router(app);
}
