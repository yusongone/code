var Common=require("./common");
var ejs=Common.ejs;
var config=Common.config;
var ctrl=Common.ctrl;
var js_version=config.js_version;
var css_version=config.css_version;
var upload_max_size=1024*1024*2;

var checkLogind=Common.checkLogind;

function setApp(app){
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
                    res.send({"status":"ok"});
                }else{
                    res.send({"status":"sorry"});
                }
            });
        };
    });

//================================================  product ================//
    app.post('/addProduct', function(req, res){
        var reqBody=req.body;
        var jsonReq={};
            jsonReq.userId=req.session.userId;
            jsonReq.name=reqBody.productName;
        if(checkLogind(req,res)){
            ctrl.Product.addProduct(jsonReq,function(err,json){
                if(err){return res.send({"status":"error","message":err})}
                res.send({"status":"ok","id":json});
            });
        };
    });

    app.post('/getAllProduct', function(req, res){
        var reqBody=req.body;
        var jsonReq={};
            jsonReq.userId=req.session.userId;
            console.log("ff",jsonReq.userId);
        if(checkLogind(req,res)){
            ctrl.Product.getProductByUserId(jsonReq,function(err,json){
                if(err){return res.send({"status":"error","message":err})}
                res.send({"status":"ok","data":json});
            });
        };
    });

    app.post('/changeProduct', function(req, res){
        var reqBody=req.body;
        var jsonReq={};
            jsonReq.userId=req.session.userId;
            jsonReq.name=reqBody.productName;
            jsonReq.size=reqBody.size;
            jsonReq.description=reqBody.description;
            jsonReq.imgPath=reqBody.imagePath;
            jsonReq.price=reqBody.price;
            jsonReq.productId=reqBody.productId;

            if(checkLogind(req,res)){
                ctrl.Product.changeProduct(jsonReq,function(json){
                    res.send(json);
                });
            };
    });

    app.post("/uploadProductHeadImage",function(req,res){
        if(checkLogind(req,res)){
            ctrl.Product.uploadProductHeadImage({},function(err,result){
                
            });
        };
    });

    app.post('/getCustomerProduct', function(req, res){
        var reqBody=req.body;
        var jsonReq={};
            jsonReq.userId=req.session.userId;
        if(checkLogind(req,res)){
            ctrl.Product.getProductList(jsonReq,function(err,json){
                res.send(json);
            });
        };
    });



//-------------------------------------- product --------------------------//

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
    app.post('/deleteImage', function(req, res){
        var cusInfoId=req.body.cusInfoId;
        var fileId=req.body.fileId;
        if(checkLogind(req,res)){
            ctrl.Images.deleteImage({
                cusInfoId:cusInfoId,
                fileId:fileId,
                userId:req.session.userId
            },function(err,result){
                if(err){return res.send({"status":"error","message":err})}
                res.send({"status":"ok","cusInfoId":cusInfoId}); 
            });
        }
    });
    //上传图片
    app.post('/uploadImageToImagesLib', function(req, res){
        if(checkLogind(req,res)){
            var jsonReq={};
                jsonReq.files=req.files.files;
                jsonReq.cusInfoId=req.body.cusInfoId;
                jsonReq.userId=req.session.userId;
                var ImageSize=jsonReq.files[0].size;
                if(parseInt(ImageSize)>upload_max_size){
                    return res.send({"stuats":"sorry","message":"Image too large"});
                }
            ctrl.ImageLibs.uploadImageToImagesLib(jsonReq,function(err,json){
                res.send(json);
            });
        };
    });
    //获取选片图片列表
    app.post('/getSelectImages', function(req, res){
        if(checkLogind(req,res)){
            var jsonReq={};
                jsonReq.cusInfoId=req.body.cusInfoId;
                jsonReq.userId=req.session.userId;
            ctrl.ImageLibs.getSelectPhotos(jsonReq,function(err,result){
                if(result&&result.status=="ok"){
                    res.send({"status":"ok","data":result.data});
                }else{
                    res.send({"status":"sorry","data":[]});
                }
            });
        };
    });
    //根据图片库Id获取图片列表
    app.post('/getCustomerImages', function(req, res){
        if(checkLogind(req,res)){
            var cusInfoId=req.body.cusInfoId;
            var jsonReq={};
                jsonReq.cusInfoId=cusInfoId;
                jsonReq.userId=req.session.userId;
            ctrl.ImageLibs.getCustomerImages(jsonReq,function(err,result){
                if(result&&result.status=="ok"){
                    res.send({"status":"ok","data":result.data});
                }else{
                    res.send({"status":"sorry","data":[]});
                }
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
exports.initApp=function(app){
    setApp(app);
}
