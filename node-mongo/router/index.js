var ejs=require("ejs");
    config=require("../config.json");
var js_version=config.js_version,
    css_version=config.css_version;
    var fs=require("fs");
    var db=require("../db/client");
    var ctrl=require("../control");

function checkLogind(req){
    if(req.session.username){
        return true;
    }else{
        return false;
    }
}


function router(app){
    app.get('/', function(req, res){
          res.send('hello world');
          console.log("fddf");
    });
    app.get('/read', function(req, res){
        db.getImage();
    });
    app.get('/login', function(req, res,next){
        res.render("login",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"登录",
        });
    });
    app.get('/register', function(req, res){
        res.render("register",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"注册",
        });
    });
    app.get('/image_library', function(req, res){
        res.render("image_library",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"图片库",
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
        res.send("ok");
    });
    app.post('/ajax_createImageLibs', function(req, res){
        if(checkLogind(req)){
            console.log("effe");
            ctrl.ImageLibs.createImageLibs({
                "username":req.session.username,
                "libname":req.body.libname
            },function(json){
                res.send(json);
            });
        }else{
            res.send({"status":"sorry","message":"用户登录已经超时，请重新登录！"});
        };
    });
    app.post('/ajax_getImageLibs', function(req, res){
        if(checkLogind(req)){
            ctrl.ImageLibs.getImageLibs(req.session.username,function(json){
                res.send(json);
            });
        }else{
            res.send({"status":"sorry","message":"用户登录已经超时，请重新登录！"});
        };
    });

    app.post('/ajax_login', function(req, res){
        db.users.compareNameAndPass({
            "userName":req.body.username,
            "pass":req.body.pass
        },function(json){
            if("ok"==json.status){
                req.session.username=req.body.username;
            }
            res.send(json); 
        });
    });
    app.post('/ajax_register', function(req, res){
        db.users.insertUserName({
            userName:req.body.username,
            pass:req.body.pass
        },function(json){
            res.send(json); 
        });
    });
}
exports.init=function(app){
    router(app);
}
