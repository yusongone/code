var ejs=require("ejs");


function router(app){
    app.get('/', function(req, res){
          res.send('hello world');
          console.log("fddf");
    });
    app.get('/test', function(req, res){
          //res.send('hello world');
        res.render("a",{"title":"li test","li":[1,2,3,4]});
    });
}
exports.init=function(app){
    router(app);
}
