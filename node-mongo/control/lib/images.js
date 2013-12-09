var db=require("../../db");
var fs=require("fs");
var Canvas=require("canvas");
    var Image=Canvas.Image;
var getPool=db.Common.getPool;
var poolMain=getPool("main");
var poolThumbnail=getPool("thumbnail");

var _getThumbnailImage=require("./thumbnail").getThumbnailImage;

var getAlbumImage=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.checkPhotoInAlbum(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            if(result){
                if(jsonReq.size=="origin"){
                        db.Images.getImage(jsonReq,function(err,buf){
                            poolMain.release(database);
                            callback(err,buf);
                        });
                    return;
                }else{
                    poolMain.release(database);
                }
                _getThumbnailImage(jsonReq,function(err,buf){
                    callback(err,buf);
                });
            }else{
                callback("no auth");
            }
        });
    });
}

var getPublicImage=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Images.getImageInfoById(jsonReq,function(err,result){
            poolMain.release(database);
            if(result&&result.metadata&&result.metadata.property=="public"){
                if(jsonReq.size=="origin"){
                        db.Images.getImage(jsonReq,function(err,buf){
                            poolMain.release(database);
                            callback(err,buf);
                        });
                    return;
                }
                _getThumbnailImage(jsonReq,function(err,buf){
                    callback(err,buf);
                });
            }else{
                console.log("no image");
                callback("no image");
            };
        });
    });
}

//获取图片
var _getImage=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        if(err){return callback(err);}
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,UserTitle){
            if(err){
                poolMain.release(database);
                return callback(err)
            };
            if("creator"==UserTitle||"binder"==UserTitle){
                //get database
                //检查图片是否存在此Customer 库中；
                db.ImageLibs.checkImageInCustomer(jsonReq,function(err,result){
                    if(err){
                        poolMain.release(database);
                        return callback(err);}
                    //null 此图片不存在此图片库中
                    if(result==null){
                        poolMain.release(database);
                        return callback("no image")
                    };
                    if(jsonReq.size=="origin"){
                        if("creator"==UserTitle){
                            db.Images.getImage(jsonReq,function(err,buf){
                                poolMain.release(database);
                                callback(err,buf);
                            });
                        }else{
                            callback("you are not this image creator");
                        }
                        return;
                    }
                    poolMain.release(database);
                    /*
                    */
                    _getThumbnailImage(jsonReq,function(err,buf){
                        callback(err,buf);
                    });
                });
            }else{
                callback("no permission");
            }
        });
    });
};


exports.getImage=_getImage;
exports.getPublicImage=getPublicImage;
exports.getAlbumImage=getAlbumImage;
