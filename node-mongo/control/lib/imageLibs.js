var db=require("../../db");
var parse=require("./common").parse;

//


//====================================
    var _getImageLibs=function(username,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        if(err){return callback(err);}
        db.ImageLibs.getImageLibs({
            database:database,     
            username:username
        },function(err,json){
            var da=json.data;
            var tempAry=[];
            for(var i=0,l=da.length;i<l;i++){
                var z={
                    "name":da[i].name,
                    "id":parse.strToBase64(da[i]._id.toString())
                }
                tempAry.push(z);
            }
            callback(err,tempAry);
            database.close();
        }); 
    });
    };
//创建一个图片库
var _createImageLibs=function(json,callback){
    db.ImageLibs.createImageLibs(json,function(err,result){
        callback(err,result);
        database.close();
    }); 
};

//上传图片并插入Id到ImagesLib;
var _uploadImageToImagesLib=function(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        if(err){return callback(err);}
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            console.log(result);
            if("creator"!=result){
                database.close();
                callback(err,{"status":"sorry","message":"no permission"});
            }else{
                db.Images.uploadImage(jsonReq,function(err,fileId){
                    jsonReq.fileId=fileId;
                    //把添加的图片Id添加到imagesLib中；
                    db.ImageLibs.addImageIdToLibs(jsonReq,function(err,result){
                        database.close();
                        callback(err,result);
                    });
                });       
            }
        });
    });
};
//获取图片
var _getImage=function(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        if(err){return callback(err);}
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if("creator"==result||"binder"==result){
                //get database
                db.Images.getImage(jsonReq,function(err,buf){
                    database.close();
                    callback(err,buf);
                });
            }else{
                callback("no permission");
            }
        });
    });
};

    var _getImagesByCusInfoId=function(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        if(err){return callback(err);}
        //var strId=parse.base64ToStr(id);
        var cusInfoId=jsonReq.cusInfoId;
        var userId=jsonReq.userId;
        db.Customer.getImageLibsId({
            cusInfoId:cusInfoId,
            userId:userId
        },function(err,jsonRes){
            if(jsonRes){
                db.ImageLibs.getDatasByLibId({
                    database:database,
                    imagesLibId:jsonRes
                },function(err,item){
                    database.close();
                    if(item&&item.images){
                        callback(err,item.images);
                    }else{
                        callback("sorry");
                    }
                });
            }
        });
    });
    };
// user 用户 选片 图片列表；
// 通过bindUser 查找 CusInfoId ,通过 CusInfoId 返回Images信息
function _getSelectPhotos(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,relation){
            if("binder"==relation){
                db.ImageLibs.getImagesListByCusInfoId(jsonReq,function(err,result){
                    database.close();
                    if(result){
                        callback(err,{"status":"ok","data":result});    
                    }else{
                        callback(err,{"status":"sorry"});
                    }
                });
            }
        });
    })

};


//通过userId和cusInfoId查找 图片库所有内容；
function _getCustomerImages(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,relation){
            if("creator"==relation){
                db.ImageLibs.getImagesListByCusInfoId(jsonReq,function(err,result){
                    database.close();
                    if(result){
                        callback(err,{"status":"ok","data":result});    
                    }else{
                        callback(err,{"status":"sorry"});
                    }
                });         
            }else{
                callback(err,{"status":"sorry"});
            }
             
        });
    });
}

exports.getImageLibs=_getImageLibs;
exports.createImageLibs=_createImageLibs;
exports.uploadImageToImagesLib=_uploadImageToImagesLib;
exports.getImage=_getImage;
exports.getImagesByCusInfoId=_getImagesByCusInfoId;
//exports.checkLibsBelong=_checkLibsBelong;


exports.getSelectPhotos=_getSelectPhotos;
exports.getCustomerImages=_getCustomerImages;
