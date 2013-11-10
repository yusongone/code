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
            res.redirect("/photos");
            res.render("index",{
                "js_version":js_version,
                "css_version":css_version,
                "title":"首页"
            });
        /*
        res.writeHead(200, {'Content-Type': 'image/png' });
        console.log(data);
        res.end(data, 'binary');
        */
    });

    //qq login  ========start

    app.get("/qqlogin",function(req,res){
        var url=ctrl.Oauth.QQ.getPath();
        res.redirect(url);
    });

    app.get("/callback",function(req,res){
        var Acode=req.query.code;
        var qq=ctrl.Oauth.QQ;
        var url=qq.packagePathToGetToken(Acode);
            qq.getToken(url,function(json){
                if(json.status=="ok"){
                    qq.getOpenId(json.data,function(result){
                        if(result.status=="ok"){
                            res.redirect("/");
                        }else{
                            res.send(result.message);
                        }
                    }); 
                }else{
                    res.send(json.message);
                }
            });
    });
    //qq login ========= end 
    

    app.get('/test', function(req, res){
        //db.test();
        console.dir(req);
        res.send("ok");
    });
    app.get("/select_photos",function(req,res){
        if(checkLogind(req,res,"get","/select_photos")){
            res.render("select_photos",{
                "js_version":js_version,
                "css_version":css_version,
                "user":{"name":"song","qq":"20126162"},
                "title":"选片"
            });
        }
    })
    app.get("/photos",function(req,res){
        if(checkLogind(req,res,"get","/photos")){
            res.render("photos",{
                "js_version":js_version,
                "css_version":css_version,
                "user":{"name":"song","qq":"20126162"},
                "title":"相册"
            });
        }
    })
    //b  ------------------- b ------
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
        if(checkLogind(req,res,"get","/b/manage_image"+req.params.id)){
            var json={
                "libId":req.params.id,
                "userId":req.session.userId
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

    app.get('/login', function(req,res){
        var path=req.query.path;
        if(path){path=path.toString()};
        res.render("login",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"登录",
            "path":path
        });
    });
    app.get('/register', function(req, res){
        res.render("register",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"注册"
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
    app.get("/verifyCode",function(req,res){
        ctrl.VerifyCode.getVcode(function(jsonRes){
            var buf=jsonRes.buf;
            var vcode=jsonRes.vcode;
                req.session.vcode=vcode;
                res.writeHead(200, {'Content-Type': 'image/png' });
                res.end(buf, 'binary');
        });
    });


    app.get('/bindLink/:cusId', function(req, res){
        var jsonReq={};
        if(checkLogind(req,res,"get")){
            jsonReq.userId=req.session.userId;
            jsonReq.cusId=req.params.cusId;
            ctrl.Customer.checkBind(jsonReq,function(err,result){
                if(!result){
                    res.render("bindlink",{
                        "js_version":js_version,
                        "css_version":css_version,
                        "cusId":jsonReq.cusId,
                        "title":"绑定用户"
                    });
                }else{
                    res.render("error",{
                        "js_version":js_version,
                        "css_version":css_version,
                        "title":"Error",
                        "message":"此对象已经进行过绑定，请不要重复绑定；"
                    });    
                }
            });
        };
    });
    app.post('/bindLink', function(req, res){
        console.log(req.session.vcode);
        var jsonReq={};
        var cusId=req.body.cusId;
        var reserverMessage=req.body.reserverMessage;
        if(!(reserverMessage&&cusId)){
            res.send({"status":"error","message":"params error"});
            return ;
        }
        if(checkLogind(req,res)){
            jsonReq.cusId=cusId;
            jsonReq.userId=req.session.userId;
            jsonReq.reserverMessage=reserverMessage;
            ctrl.Customer.bindUser(jsonReq,function(err,json){
                if(err){return res.send({"status":"sorry","message":err})}
                if(json>0){
                    res.send({"status":"bind ok"});
                }
            });
        };
    });



    //查找用户 user
    app.post('/ajax_searchUser', function(req, res){
        if(checkLogind(req,res)){
            ctrl.Users.searchUser({keyword:req.body.keyword},function(json){
                res.send(json);
            });
        };
    });

    //查找客户 
    app.post('/ajax_searchCustomer', function(req, res){
        if(checkLogind(req,res)){
            ctrl.Customer.searchCustomer({keyword:req.body.keyword},function(json){
                res.send(json);
            });
        };
    });

    //添加客户
    app.post('/ajax_addCustomer', function(req, res){
        var reqBody=req.body;
        var jsonReq={};
            jsonReq.username=req.session.username;
            jsonReq.userId=req.session.userId;

            jsonReq.boyName=reqBody.boyName;
            jsonReq.boyPhone=reqBody.boyPhone;
            jsonReq.boyOther=reqBody.boyOther;
            jsonReq.girlName=reqBody.girlName;
            jsonReq.girlPhone=reqBody.girlPhone;
            jsonReq.girlOther=reqBody.girlOther;
            jsonReq.message=reqBody.message;
            jsonReq.address=reqBody.address;

        if(checkLogind(req,res)){
            ctrl.Customer.addCustomer(jsonReq,function(err,json){
                res.send(json);
            });
        };
    });
    //获取客户列表
    app.post('/ajax_getCustomer', function(req, res){
        var username=req.session.username;
        var userId=req.session.userId;
        if(checkLogind(req,res)){
            ctrl.Customer.getCustomerList({userId:userId},function(err,json){
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
            var path=req.body.path;
        ctrl.Users.login({
            "username":req.body.username,
            "pass":req.body.pass
        },function(err,json){
            if("ok"==json.status){
                req.session.username=req.body.username;
                req.session.userId=json.userId;
            }
            res.send(json); 
        });
    });
    //注册
    app.post('/ajax_register', function(req, res){
        ctrl.Users.insertUserName({
            username:req.body.username,
            pass:req.body.pass
        },function(err,json){
            res.send(json); 
        });
    });
}
exports.init=function(app){
    router(app);
}
