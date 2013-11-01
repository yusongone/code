var ejs=require("ejs");
    config=require("../config.json");
var js_version=config.js_version,
    css_version=config.css_version;
    var fs=require("fs");
    var db=require("../db");
    var ctrl=require("../control");

    var test=require("../test/canvas_test");


function checkLogind(req,res,type,path){
    if(req.session.username){
        return true;
    }else{
        if("get"==type){
            var path=path?"?path="+path:"";
            res.redirect("/login"+path);
        }else{
            res.send({"status":"sorry","message":"用户登录已经超时，请重新登录！"});
            return false;
        }
    }
}

var data;
function router(app){
    app.get('/', function(req, res){
        if(checkLogind(req,res,"get","")){
            res.redirect("/image_library");
        }
        /*
        res.writeHead(200, {'Content-Type': 'image/png' });
        console.log(data);
        res.end(data, 'binary');
        */
    });
    app.get('/test', function(req, res){
        //db.test();
    });

    //b
    app.get('/b/image_library', function(req, res){
        if(checkLogind(req,res,"get","/b/image_library")){
            res.render("image_library",{
                "js_version":js_version,
                "css_version":css_version,
                "P_css":"image_libs",
                "P_js":"image_libs",
                "user":{"name":"song","qq":"20126162"},
                "title":"图片库"
            });
        }
    });
    app.get('/b/manage_image/:id', function(req, res){
        if(!req.params.id){ res.redirect("/404"); };
        if(checkLogind(req,res,"get","/b/manage_image")){
            var json={
                "libId":req.params.id,
                "username":req.session.username
            };
            //验证登陆用户是否存在此id 图片库
            ctrl.ImageLibs.checkLibsBelong(json,function(bool){
                if(bool){
                    res.render("manage_image",{
                        "js_version":js_version,
                        "css_version":css_version,
                        "title":"uploadImage",
                        "id":req.params.id
                    });
                }else{
                    res.redirect("/404"); 
                }
            });
        }
    });
    app.get('/b/customer', function(req, res){
        if(checkLogind(req,res,"get","/b/customer")){
            res.render("customer",{
                "js_version":js_version,
                "css_version":css_version,
                "P_css":"customer_page",
                "P_js":"customer_page",
                "title":"客户管理",
                "user":{"name":"song","qq":"20126162"},
                "id":req.query.id
            });
        }
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
    app.get('/images/:libId/:imageId', function(req, res){
        var libId=req.params.libId;
        var imageId=req.params.imageId;
        if(libId.toString()&&imageId.toString()){
            if(checkLogind(req,res,"get")){
                ctrl.ImageLibs.getImage({"libId":libId,"imageId":imageId,"username":req.session.username},function(data){
                    res.writeHead(200, {'Content-Type': 'image/png' });
                    res.end(data, 'binary');
                });
            }
        }
    });

    //查找用户 user
    app.post('/ajax_searchUser', function(req, res){
        if(checkLogind(req,res)){
            ctrl.Users.searchUser({keyword:req.body.keyword},function(json){
                res.send(json);
            });
        };
    });

    //添加客户
    app.post('/ajax_addCustomer', function(req, res){
        if(checkLogind(req,res)){
            ctrl.Customer.addCustomer({username:req.session.username,cusUsername:req.body.cusUsername},function(json){
                res.send(json);
            });
        };
    });
    //获取客户列表
    app.post('/ajax_getCustomer', function(req, res){
        if(checkLogind(req,res)){
            var file=req.files.dfile,
                lib_id=req.body.lib_id;
            ctrl.Customer.getCustomerList({username:req.session.username},function(json){
                res.send(json);
            });
        };
    });
    //上传图片
    app.post('/uploadImage', function(req, res){
        if(checkLogind(req,res)){
            var files=req.files,
                lib_id=req.body.lib_id;
            ctrl.ImageLibs.uploadImage({files:files.files,libId:lib_id,username:req.session.username},function(json){
                res.send(json);
            });
        };
    });
    //根据图片库Id获取图片列表
    app.post('/getImagesByLibId', function(req, res){
        if(checkLogind(req,res)){
            var id=req.body.libId;
            ctrl.ImageLibs.getImagesByLibId(id,function(ary){
                res.send({"status":"ok","data":ary});
            });
        };
    });
    //创建图片库
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
    //获取图片库列表
    app.post('/ajax_getImageLibs', function(req, res){
        if(checkLogind(req,res)){
            ctrl.ImageLibs.getImageLibs(req.session.username,function(json){
                res.send(json);
            });
        }
    });
    //登录
    app.post('/ajax_login', function(req, res){
        db.Users.compareNameAndPass({
            "userName":req.body.username,
            "pass":req.body.pass
        },function(json){
            if("ok"==json.status){
                req.session.username=req.body.username;
                req.session.userId=json.userId;
            }
            res.send(json); 
        });
    });
    //注册
    app.post('/ajax_register', function(req, res){
        db.Users.insertUserName({
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
