var Common=require("./common");
var ejs=Common.ejs;
var config=Common.config;
var ctrl=Common.ctrl;
var js_version=config.js_version;
var css_version=config.css_version;
var upload_max_size=1024*1024*2;

var checkLogind=Common.checkLogind;

function setApp(app){
     app.get('/', function(req, res){
            res.redirect("/photos");
            res.render("index",{
                "js_version":js_version,
                "css_version":css_version,
                "title":"首页"
            });
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
    //qq login ========= end 
    

    app.get('/test', function(req, res){
        //db.test();
        res.send("ok");
    });
    app.get("/select_photos",function(req,res){
        if(checkLogind(req,res,"get","/select_photos")){
            //
            var jsonReq={};
                jsonReq.userId=req.session.userId;
            ctrl.Customer.getCustomerInfoIdByBindUserId(jsonReq,function(err,cusInfoId){
                var cusId=cusInfoId||"";
                res.render("select_photos",{
                    "js_version":js_version,
                    "css_version":css_version,
                    "user":{"name":req.session.username},
                    "title":"选片",
                    "cusInfoId":cusId
                });
            });
        }
    });

    app.get("/photos",function(req,res){
        if(checkLogind(req,res,"get","/photos")){
            res.render("photos",{
                "js_version":js_version,
                "css_version":css_version,
                "user":{"name":req.session.username},
                "title":"相册"
            });
        }
    })
    //b  ------------------- b ------
    app.get("/b/image_module",function(req,res){
        if(checkLogind(req,res,"get","/b/image_module")){
            var jsonReq={};
                jsonReq.userId=req.session.userId;
            ctrl.Customer.getCustomerInfoIdByBindUserId(jsonReq,function(err,cusInfoId){
                var cusId=cusInfoId||"";
                res.render("image_module",{
                    "js_version":js_version,
                    "css_version":css_version,
                    "user":{"name":req.session.username},
                    "title":"模板管理",
                    "cusInfoId":cusId
                });
            });
        }
    });
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
    app.get('/b/manage_image/:cusInfoId', function(req, res){
        if(!req.params.cusInfoId){ res.redirect("/404"); };
        if(checkLogind(req,res,"get","/b/manage_image"+req.params.id)){
            var jsonReq={}
                jsonReq.cusInfoId=req.params.cusInfoId,
                jsonReq.userId=req.session.userId
            //检测本用户下是否存在此库
            ctrl.ImageLibs.getCustomerImages(jsonReq,function(err,result){
                var r;
                if(result&&result.length>0){
                    r=1;
                }else{
                    r=0;
                }
                    res.render("manage_image",{
                        "js_version":js_version,
                        "css_version":css_version,
                        "title":"图片管理",
                        "id":req.params.cusInfoId,
                        "result":r
                    });
            });
        }
    });
    app.get('/b/customer', function(req, res){
        if(checkLogind(req,res,"get","/b/customer")){
            res.render("customer",{
                "js_version":js_version,
                "css_version":css_version,
                "title":"客户管理",
                "user":{"name":req.session.username,"qq":"20126162"},
                "id":req.query.id
            });
        }
    });
    //获取公共图片
    app.get("/public_image/:imageId",function(req,res){
        var imageId=req.params.imageId;
        var userId=req.session.userId;
        var sizeR={"origin":"origin","300":300,"180":180,"100":100};
        var typeR={"fill":"fill"}
        var size=sizeR[req.query.size]||180;
        var type=typeR[req.query.type]||"normal";
            ctrl.Images.getPublicImage({
                "fileId":imageId,
                "userId":userId,
                "imageType":type,
                "size":size
            },function(err,data){
                res.writeHead(200, {'Content-Type': 'image/png' });
                res.end(data, 'binary');
            });
    });
    app.get('/photo/:cusInfoId/:imageId', function(req, res){
        var cusInfoId=req.params.cusInfoId;
        var imageId=req.params.imageId;
        var userId=req.session.userId;
        var sizeR={"origin":"origin","300":300,"180":180,"100":100};
        var typeR={"fill":"fill"}
        var size=sizeR[req.query.size]||180;
        var type=typeR[req.query.type]||"normal";
        if(cusInfoId.toString()&&imageId.toString()){
            if(checkLogind(req,res,"get")){
                ctrl.Images.getImage({
                        "cusInfoId":cusInfoId,
                        "fileId":imageId,
                        "userId":userId,
                        "imageType":type,
                        "size":size
                },function(err,data){
                    if(err){
                        res.redirect("/404");
                    }else{
                        res.writeHead(200, {'Content-Type': 'image/png' });
                        res.end(data, 'binary');
                    }
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
}
exports.initApp=function(app){
    setApp(app);
}
