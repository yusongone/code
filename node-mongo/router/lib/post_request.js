var Common=require("./common");
var ejs=Common.ejs;
var config=Common.config;
var ctrl=Common.ctrl;
var js_version=config.js_version;
var css_version=config.css_version;
var upload_max_size=1024*1024*10;

var checkLogind=Common.checkLogind;

function setApp(app){
    app.post('/bindLink', function(req, res){
        var jsonReq={};
        var cusId=req.body.cusId;
        var reserverMessage=req.body.reserverMessage;
        var reqVcode=req.body.vcode;
        if(!(reserverMessage&&cusId&&reqVcode)){
            res.send({"status":"error","message":"params error"});
            return ;
        }
        if(checkLogind(req,res)){
            jsonReq.cusId=cusId;
            jsonReq.userId=req.session.userId;
            jsonReq.reserverMessage=reserverMessage;
            if(reqVcode!=req.session.vcode){
                return res.send({"stuats":"sorry","message":"vcode error"});
            }
            ctrl.Customer.bindUser(jsonReq,function(err,json){
                if(err){return res.send({"status":"sorry","message":err})}
                if(json>0){
                    res.send({"status":"ok"});
                }else{
                    res.send({"status":"sorry","message":"code error"});
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
        if(checkLogind(req,res)){
            ctrl.Product.getProductsByUserId(jsonReq,function(err,json){
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
            jsonReq.imgCount=reqBody.imgCount;

            if(checkLogind(req,res)){
                ctrl.Product.changeProduct(jsonReq,function(err,json){
                    if(json>0){
                        res.send({"status":"ok"});
                    }else{
                        res.send({"status":"sorry"});
                    }
                });
            };
    });

    app.post("/uploadProductHeadImage",function(req,res){
        var jsonReq={};
        jsonReq.files=req.files.files;
        jsonReq.productId=req.body.productId;
        jsonReq.userId=req.session.userId;
        if(checkLogind(req,res)){
            ctrl.Product.uploadProductHeadImage(jsonReq,function(err,result){
                  
            });
        };
    });


//-------------------------------------- product end --------------------------//

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

    //提交选片列表
    app.post('/ajax_uploadSelectPhotoList', function(req, res){
        if(checkLogind(req,res)){
            var jsonReq={};
                jsonReq.objStr=req.body.objStr;
                jsonReq.userId=req.session.userId; 
            ctrl.Customer.uploadSelectPhotoList(jsonReq,function(err,result){
                if(err){return res.send({"status":"error","message":err})};
                res.send({"status":"ok"});
            });
        };
    });

    app.post('/ajax_getSelects', function(req, res){
        if(checkLogind(req,res)){
            var jsonReq={};
                jsonReq.objStr=req.body.objStr;
                jsonReq.userId=req.session.userId; 
                jsonReq.cusInfoId=req.body.cusInfoId;
            ctrl.Customer.getSelects(jsonReq,function(err,result){
                if(err){return res.send({"status":"error","message":err})};
                res.send({"status":"ok","data":result});
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
    //给customerInfo 绑定 product
    app.post("/ajax_bindProductToCustomer",function(req,res){
        var userId=req.session.userId;
        var jsonReq={};
            jsonReq.userId=userId;
            jsonReq.productId=req.body.productId;
            jsonReq.cusInfoId=req.body.cusInfoId;
        if(checkLogind(req,res)){
            ctrl.Customer.addProductToCustomer(jsonReq,function(err,result){
                if(err){return res.send({"status":"error","message":err})}
                res.send({"status":"ok"});
            });
        }
    });
    //从customerInfo中删除product；
    app.post("/ajax_removeProductFromCustomer",function(req,res){
        var userId=req.session.userId;
        var jsonReq={};
            jsonReq.userId=userId;
            jsonReq.productId=req.body.productId;
            jsonReq.cusInfoId=req.body.cusInfoId;
        if(checkLogind(req,res)){
            ctrl.Customer.removeProductFromCustomer(jsonReq,function(err,result){
                if(err){return res.send({"status":"error","message":err})}
                res.send({"status":"ok"});
            });
        }
    });

    //减少1个，如果为0则会删除；
    app.post("/ajax_subProductFromCustomer",function(req,res){
        var userId=req.session.userId;
        var jsonReq={};
            jsonReq.userId=userId;
            jsonReq.productId=req.body.productId;
            jsonReq.cusInfoId=req.body.cusInfoId;
        if(checkLogind(req,res)){
            ctrl.Customer.subProductFromCustomer(jsonReq,function(err,result){
                if(err){return res.send({"status":"error","message":err})}
                res.send({"status":"ok"});
            });
        }
    });

    //获取customerInfo下得所有模板 product
    app.post("/ajax_getProductsFromCustomer",function(req,res){
        var userId=req.session.userId;
        var jsonReq={};
            jsonReq.userId=userId;
            jsonReq.cusInfoId=req.body.cusInfoId;
        if(checkLogind(req,res)){
            ctrl.Customer.getProductsFromCustomer(jsonReq,function(err,result){
                if(err){return res.send({"status":"error","message":err})}
                res.send({"status":"ok","data":result});
            });
        }
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
    app.post('/deletePhoto', function(req, res){
        var cusInfoId=req.body.cusInfoId;
        var fileId=req.body.fileId;
        if(checkLogind(req,res)){
            ctrl.ImageLibs.deletePhoto({
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
                res.send({"status":"ok","message":"登陆成功!"}); 
            }else{
                res.send({"status":"sorry","message":"用户名和密码不正确"}); 
            }
        });
    });
    //检测用户名 
    app.post('/ajax_checkUsername', function(req, res){
        var username=req.body.username;
        if(!username){
            return res.send({"status":"sorry","message":"参数不完整!"});
        }
        var jsonReq={};
            jsonReq.username=username;
        ctrl.Users.checkUsername(jsonReq,function(err,result){
            if(err){
                return res.send({"status":"error","message":err});
            } 
            if(result){
                res.send({"status":"sorry","message":"用户名已经存在"});
            }else{
                res.send({"status":"ok","message":"可以使用"});
            }

        }); 
    });
    //注册
    app.post('/ajax_register', function(req, res){
        if(!(req.body.username&&req.body.pass&&req.body.vcode)){
            return res.send({"status":"sorry","message":"参数不完整!"});
        }
        var reqVcode=req.body.vcode;
        if(reqVcode!=req.session.vcode){
            return res.send({"status":"sorry","message":"验证码错误!"});
        }

        var jsonReq={};
            jsonReq.username=req.body.username;
            jsonReq.pass=req.body.pass
        ctrl.Users.checkUsername(jsonReq,function(err,result){
            if(err){
                return res.send({"status":"error","message":err});
            } 
            if(result){
                return res.send({"status":"sorry","message":"用户名已经存在"});
            }else{
                ctrl.Users.insertUserName(jsonReq,function(err,json){
                    res.send(json); 
                });
            }
        });
    });
}
exports.initApp=function(app){
    setApp(app);
}
