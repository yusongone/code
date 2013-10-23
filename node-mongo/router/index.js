var ejs=require("ejs");
    config=require("../config.json");
var js_version=config.js_version,
    css_version=config.css_version;
    var fs=require("fs");
    var db=require("../db/client");
    var ctrl=require("../control");

function checkLogind(req,res,type){
    if(req.session.username){
        return true;
    }else{
        if("get"==type){
            res.send("用户登录已经超时，请重新登录！");
            return false;
        }else{
            res.send({"status":"sorry","message":"用户登录已经超时，请重新登录！"});
            return false;
        }
    }
}


function router(app){
    app.get('/', function(req, res){
          res.send('hello world');
          console.log("fddf");
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
    app.get('/manage_image', function(req, res){
        res.render("manage_image",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"uploadImage",
            "id":req.query.id
        });
    });
    app.get('/images/*', function(req, res){
        ctrl.ImageLibs.getImage(req.params[0],function(data){
            res.writeHead(200, {'Content-Type': 'image/gif' });
            res.end(data, 'binary');
        });
    });


    app.post('/uploadImage', function(req, res){
        if(checkLogind(req,res)){
            var file=req.files.dfile,
                lib_id=req.body.lib_id;
            ctrl.ImageLibs.uploadImage({file:file,libId:lib_id},function(json){
                res.send(json);
            });
        };
    });
    app.post('/getImagesByLibId', function(req, res){
        if(checkLogind(req,res)){
            var id=req.body.libId;
            ctrl.ImageLibs.getImagesByLibId(id,function(ary){
                res.send({"status":"ok","data":ary});
            });
        };
    });
    app.post('/ajax_createImageLibs', function(req, res){
        if(checkLogind(req,res)){
            ctrl.ImageLibs.createImageLibs({
                "username":req.session.username,
                "libname":req.body.libname
            },function(json){
                res.send(json);
            });
        }
    });
    app.post('/ajax_getImageLibs', function(req, res){
        if(checkLogind(req,res)){
            ctrl.ImageLibs.getImageLibs(req.session.username,function(json){
                res.send(json);
            });
        }
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
